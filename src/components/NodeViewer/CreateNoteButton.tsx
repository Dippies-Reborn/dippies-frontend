import { AiFillFileAdd, AiFillFileImage } from "react-icons/ai";
import React, { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { BN } from "bn.js";
import { MAX_CHILD_PER_NODE } from "../../programs/dippiesIndexProtocol";
import { NodeWithKey } from "../../hooks/useTree";
import { Transaction } from "@solana/web3.js";
import { TreeDeaNode } from "../../programs/dippiesIndexProtocol/node";
import { WebBundlr } from "@bundlr-network/client";
// @ts-ignore
import fileReaderStream from "filereader-stream";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import useProvider from "../../hooks/useProvider";

export default ({
  node,
  onCreate,
}: {
  node: NodeWithKey;
  onCreate?: () => void;
}) => {
  const wallet = useWallet();
  const provider = useProvider();
  const { connection } = useConnection();
  const [isOpen, setIsOpen] = useState(false);
  const [website, setWebsite] = useState<string>();
  const [image, setImage] = useState<string>();
  const [uploadedImage, setUploadedImage] = useState<string>();
  const [uploadId, setUploadId] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    if (!provider) return;

    if (acceptedFiles.length > 1) {
      toast.error("Upload only a single image");
      return;
    }

    const bundler = new WebBundlr(
      "https://devnet.bundlr.network", // "https://node1.bundlr.network",
      "solana",
      wallet,
      { providerUrl: provider.connection.rpcEndpoint }
    );

    // Fund the bundlr account
    try {
      const fundRes = await bundler.fund(
        await bundler.getPrice(acceptedFiles[0].size)
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
      !provider ||
      !node ||
      !website ||
      !(image || uploadedImage) ||
      !description
    )
      return;
    const img = uploadedImage || image;
    const treedeaNode = await TreeDeaNode.fromNode(provider, node);

    if (!treedeaNode) return;

    setIsCreating(true);

    const { ix, note } = treedeaNode.createNote(website, img!, description);
    const tx = new Transaction().add(ix);

    // Auto attach if parent is empty
    if (node.notes.length < MAX_CHILD_PER_NODE)
      tx.add(note.instruction.attachNote());

    try {
      await connection.confirmTransaction(
        await wallet.sendTransaction(tx, connection)
      );
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
        <div className="modal-box flex flex-col p-5 gap-5 max-w-3xl">
          <div
            className="btn btn-sm btn-circle fixed right-2 top-2 absolute"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </div>
          <div className="text-2xl font-bold">Create a note</div>
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
                  className={`border-dashed border-neutral-content border rounded-lg p-4 my-2`}
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
