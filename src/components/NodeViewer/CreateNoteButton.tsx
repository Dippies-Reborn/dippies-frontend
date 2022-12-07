import { AiFillFileAdd, AiFillFileImage } from "react-icons/ai";
import {
  MAX_NOTES_PER_NODE,
  MAX_TAG_LENGTH,
  Node,
  getAttachNoteAccounts,
  getCreateNoteAccounts,
  getNodeAddress,
  getNoteAddress,
} from "../../programs/dippiesIndexProtocol";
import React, { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { DIPPIES_FOREST } from "../../utils/ids";
import { Keypair } from "@solana/web3.js";
import { WebBundlr } from "@bundlr-network/client"; // @ts-ignore
import fileReaderStream from "filereader-stream";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import useForest from "../../hooks/useForest";

export default ({ node, onCreate }: { node: Node; onCreate?: () => void }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { program, forest } = useForest();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [image, setImage] = useState<string>();
  const [uploadedImage, setUploadedImage] = useState<string>();
  const [uploadId, setUploadId] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!connection) return;

    if (acceptedFiles.length > 1) {
      toast.error("Upload only a single image");
      return;
    }

    const bundler = new WebBundlr(
      "https://devnet.bundlr.network", // "https://node1.bundlr.network",
      "solana",
      wallet,
      { providerUrl: connection.rpcEndpoint }
    );

    // Fund the bundlr account
    try {
      const fundRes = await bundler.fund(
        await bundler.getPrice(Math.round(acceptedFiles[0].size * 1.1))
      );
      console.log(fundRes);
    } catch (e: any) {
      setUploadId(e.toString());
      return;
    }

    const uploader = bundler.uploader.chunkedUploader;
    uploader.setBatchSize(2);
    uploader.setChunkSize(2_000_000);
    try {
      const res = await uploader.uploadData(
        fileReaderStream(acceptedFiles[0]),
        {
          tags: [
            {
              name: "Content-Type",
              value: acceptedFiles[0].type ?? "application/octet-stream",
            },
          ],
        }
      );

      console.log(res);
      if (res?.status === 200 || res?.status === 201) {
        toast.success("Successful!");
        setUploadedImage(`https://arweave.net/${res.data.id}`);
      } else {
        toast.error("Unsuccessful");
      }
    } catch (e) {
      toast.error(`Failed to upload - ${e}`);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/octet-stream": [".jpg", ".png"] },
  });

  const handleTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);
  };
  const handleWebsite: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setWebsite(e.target.value);
  };
  const handleImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setImage(e.target.value);
  };
  const handleDescription: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDescription(e.target.value);
  };

  const handleCreateNote = async () => {
    if (
      !program ||
      !program.provider.publicKey ||
      !forest ||
      !node ||
      !title ||
      !website ||
      !(image || uploadedImage) ||
      !description
    )
      return;
    const img = uploadedImage || image;

    setIsCreating(true);

    const id = Keypair.generate().publicKey;
    const noteKey = getNoteAddress(node.tree, id);
    const nodeKey = getNodeAddress(
      node.tree,
      node.parent,
      node.tags[node.tags.length - 1]
    );

    try {
      await program.methods
        .createNote(id, title, website, img!, description)
        .accounts(
          getCreateNoteAccounts(
            DIPPIES_FOREST,
            node.tree,
            nodeKey,
            id,
            program.provider.publicKey
          )!
        )
        .postInstructions(
          // Auto attach if parent is empty
          node.notes.length < MAX_NOTES_PER_NODE
            ? [
                await program.methods
                  .attachNote()
                  .accounts(
                    getAttachNoteAccounts(
                      DIPPIES_FOREST,
                      node.tree,
                      nodeKey,
                      noteKey,
                      program.provider.publicKey
                    )!
                  )
                  .instruction(),
              ]
            : []
        )
        .rpc();

      onCreate && onCreate();
      setWebsite(undefined);
      setImage(undefined);
      setDescription(undefined);
      setUploadedImage(undefined);
      setIsOpen(false);
      toast.success("Note created!");
    } catch (e: any) {
      toast.error(e.toString());
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div
        className="w-64 bg-base-100 hover:bg-base-200 transition-all border-2 border-base-200 rounded-xl shadow-inner hover:shadow-xl p-6 m-3 flex flex-col"
        onClick={() => setIsOpen(true)}
      >
        <div className="m-auto">
          <AiFillFileAdd className="w-20 h-20 m-auto" />
          <div className="text-2xl text-center">Create note</div>
        </div>
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-focus flex flex-col p-5 gap-5 max-w-3xl">
          <div
            className="btn btn-sm btn-circle fixed right-2 top-2 absolute"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </div>
          <div className="text-2xl font-bold">Create a note</div>
          <div className="bg-base-200 p-3 rounded-xl shadow-inner">
            <div className="text-lg font-bold">Title</div>
            <div className="text-sm">The title of this note.</div>
            <input
              className="input input-bordered w-full"
              placeholder="Dippies Index Protocol"
              onChange={handleTitle}
            />
            <div className="text-end justify-end">
              {title?.length || 0} / {MAX_TAG_LENGTH}
            </div>
          </div>
          <div className="bg-base-200 p-3 rounded-xl shadow-inner">
            <div className="text-lg font-bold">Website</div>
            <div className="text-sm">Website the note points to.</div>
            <input
              className="input input-bordered w-full"
              placeholder="https://..."
              onChange={handleWebsite}
            />
          </div>
          <div className="bg-base-200 p-3 rounded-xl shadow-inner">
            <div className="text-lg font-bold">Cover image</div>
            {uploadedImage ? (
              <img src={uploadedImage} className="w-32 h-32 rounded m-auto" />
            ) : (
              <>
                <div className="text-sm">The cover image of the note.</div>
                <input
                  className="input input-bordered w-full"
                  placeholder="https://..."
                  onChange={handleImage}
                />
                <div
                  {...getRootProps()}
                  className={`border-dashed border-focus-content border rounded-lg p-4 my-2`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <AiFillFileImage className="mx-auto w-12 h-12" />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>
                        Click or drag your image here to upload it to Arweave
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="bg-base-200 p-3 rounded-xl shadow-inner">
            <div className="text-lg font-bold">Description</div>
            <div className="text-sm">A short description.</div>
            <input
              className="input input-bordered w-full"
              placeholder="This project is about..."
              onChange={handleDescription}
            />
          </div>
          <div
            className={`btn btn-primary ${
              website && (image || uploadedImage) && description
                ? ""
                : "btn-disabled"
            } ${isCreating ? "btn-disabled loading" : ""}`}
            onClick={handleCreateNote}
          >
            Create a note
          </div>
        </div>
      </div>
    </>
  );
};
