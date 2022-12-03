import {
  DIP_PROGRAM_ID,
  DipIdl,
  DippiesIndexProtocol,
  Forest,
  NewAttachedNoteEvent,
  NewNodeEvent,
  NewTreeEvent,
  Node,
  Note,
  StakeState,
  Tree,
  UpdatedBribeEvent,
  UpdatedStakeEvent,
} from "../programs/dippiesIndexProtocol";
import React, { useEffect, useMemo, useState } from "react";

import { DIPPIES_FOREST } from "../utils/ids";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import useProvider from "../hooks/useProvider";

interface DipForestContextProps {
  program?: Program<DippiesIndexProtocol>;
  forest?: Forest;
  trees: { [key: string]: Tree };
  nodes: { [nodeKey: string]: Node };
  notes: { [noteKey: string]: Note };
  stakes: { [stakeKey: string]: StakeState };
  fetchTree: (key: PublicKey) => Promise<Tree | undefined>;
  fetchNode: (key: PublicKey) => Promise<Node | undefined>;
  fetchNote: (key: PublicKey) => Promise<Note | undefined>;
  fetchStake: (key: PublicKey) => Promise<StakeState | undefined>;
  isFetching: boolean;
}
export const DipForestContext = React.createContext<DipForestContextProps>({
  isFetching: false,
  trees: {},
  nodes: {},
  notes: {},
  stakes: {},
  fetchTree: (key: PublicKey) => new Promise(() => {}),
  fetchNode: (key: PublicKey) => new Promise(() => {}),
  fetchNote: (key: PublicKey) => new Promise(() => {}),
  fetchStake: (key: PublicKey) => new Promise(() => {}),
});

export const DipForestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const provider = useProvider();
  const program = useMemo(
    () =>
      provider
        ? new Program<DippiesIndexProtocol>(
            DipIdl as any,
            DIP_PROGRAM_ID,
            provider
          )
        : undefined,
    [provider?.publicKey]
  );
  const [forest, setForest] = useState<Forest>();
  const [trees, setTrees] = useState<{ [key: string]: Tree }>({});
  const [nodes, setNodes] = useState<{
    [nodeKey: string]: Node;
  }>({});
  const [notes, setNotes] = useState<{
    [noteKey: string]: Note;
  }>({});
  const [stakes, setStakes] = useState<{
    [stakeKey: string]: StakeState;
  }>({});
  const [isFetching, setIsFetching] = useState(false);

  const fetchForest = async () => {
    if (!program) return;
    setIsFetching(true);

    try {
      setForest(await program.account.forest.fetch(DIPPIES_FOREST));
    } catch (err) {
      console.log("Failed to fetch forest:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!forest) {
      fetchForest();
    }
  }, [provider?.publicKey, forest]);

  const fetchTrees = async () => {
    if (!program) return;
    setIsFetching(true);

    try {
      const t = await program.account.tree.all();

      for (const tree of t) {
        setTrees((old) => ({
          ...old,
          [tree.publicKey.toString()]: tree.account,
        }));
      }
    } catch (err) {
      console.log("Failed to fetch forest:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!trees || Object.keys(trees).length === 0) {
      fetchTrees();
    }
  }, [provider?.publicKey, trees]);

  const fetchTree = async (treeKey: PublicKey) => {
    if (!program) return;

    try {
      const tree = await program.account.tree.fetch(treeKey);
      setTrees((old) => ({
        ...old,
        [treeKey.toString()]: tree,
      }));
      return tree;
    } catch {}
  };

  const fetchNode = async (nodeKey: PublicKey) => {
    if (!program || nodeKey.equals(PublicKey.default)) return;

    console.log("fetch node", nodeKey.toString(), nodes[nodeKey.toString()]);

    try {
      const node = await program.account.node.fetch(nodeKey);
      setNodes((old) => ({
        ...old,
        [nodeKey.toString()]: node,
      }));
      return node;
    } catch (e) {
      console.log("Failed fetching node", e);
    }
  };

  const fetchNote = async (noteKey: PublicKey) => {
    if (!program) return;

    console.log(notes, noteKey.toString(), await program.account.note.all());
    try {
      const note = await program.account.note.fetch(noteKey);
      setNotes((old) => ({
        ...old,
        [noteKey.toString()]: note,
      }));
      return note;
    } catch (e) {
      console.log("Failed fetching note", e);
    }
  };

  const fetchStake = async (stakeKey: PublicKey) => {
    if (!program) return;

    try {
      const stake = await program.account.stakeState.fetch(stakeKey);
      setStakes((old) => ({
        ...old,
        [stakeKey.toString()]: stake,
      }));
      return stake;
    } catch (e) {
      console.log("Failed fetching stake", e);
    }
  };

  useEffect(() => {
    if (!program) return;

    const newTree = program.addEventListener("NewTree", (e: NewTreeEvent) => {
      console.log("new tree:", e);
      if (e && e.forest?.equals(DIPPIES_FOREST)) {
        program.account.tree.fetch(e.tree!).then((tree) => {
          setTrees((old) => ({
            ...old,
            [e.tree!.toString()]: tree,
          }));
        });
      }
    });
    const newNode = program.addEventListener("NewNode", (e: NewNodeEvent) => {
      console.log("new node:", e);
      if (e && e.forest?.equals(DIPPIES_FOREST)) {
        program.account.node.fetch(e.node!).then((node) => {
          setNodes((old) => ({
            ...old,
            [e.node!.toString()]: node,
          }));
        });
      }
    });
    const newAttachedNote = program.addEventListener(
      "NewAttachedNote",
      (e: NewAttachedNoteEvent) => {
        console.log("new attached note:", e);
        if (e && e.forest?.equals(DIPPIES_FOREST)) {
          program.account.tree.fetch(e.tree!).then((tree) => {
            setTrees((old) => ({
              ...old,
              [e.tree!.toString()]: tree,
            }));
          });
          program.account.node.fetch(e.node!).then((node) => {
            setNodes((old) => ({
              ...old,
              [e.node!.toString()]: node,
            }));
          });
          program.account.note.fetch(e.note!).then((note) => {
            setNotes((old) => ({
              ...old,
              [e.note!.toString()]: note,
            }));
          });
        }
      }
    );
    const updateStake = program.addEventListener(
      "UpdatedStake",
      (e: UpdatedStakeEvent) => {
        console.log("updated stake:", e);
        if (e && e.forest?.equals(DIPPIES_FOREST)) {
          program.account.tree.fetch(e.tree!).then((tree) => {
            setTrees((old) => ({
              ...old,
              [e.tree!.toString()]: tree,
            }));
          });
          program.account.node.fetch(e.node!).then((node) => {
            setNodes((old) => ({
              ...old,
              [e.node!.toString()]: node,
            }));
          });
          program.account.note.fetch(e.note!).then((note) => {
            setNotes((old) => ({
              ...old,
              [e.note!.toString()]: note,
            }));
          });
          program.account.stakeState.fetch(e.stake!).then((stake) => {
            setStakes((old) => ({
              ...old,
              [e.stake!.toString()]: stake,
            }));
          });
        }
      }
    );

    return () => {
      program.removeEventListener(newTree);
      program.removeEventListener(newNode);
      program.removeEventListener(newAttachedNote);
      program.removeEventListener(updateStake);
    };
  }, [program]);

  return (
    <DipForestContext.Provider
      value={{
        program,
        forest,
        trees,
        nodes,
        notes,
        stakes,
        fetchTree,
        fetchNode,
        fetchNote,
        fetchStake,
        isFetching,
      }}
    >
      {children}
    </DipForestContext.Provider>
  );
};
