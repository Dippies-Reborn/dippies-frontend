import { Accounts, Event, IdlAccounts } from "@project-serum/anchor";

import { DippiesIndexProtocol } from "./";

export type Forest = IdlAccounts<DippiesIndexProtocol>["forest"];
export type Tree = IdlAccounts<DippiesIndexProtocol>["tree"];
export type Node = IdlAccounts<DippiesIndexProtocol>["node"];
export type Note = IdlAccounts<DippiesIndexProtocol>["note"];
export type StakeState = IdlAccounts<DippiesIndexProtocol>["stakeState"];

export type CreateForestAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["0"]>
>["createForest"];
export type SetTreeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["1"]>
>["setForest"];
export type CreateTreeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["2"]>
>["createTree"];
export type CreateNodeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["3"]>
>["createNode"];
export type AttachNodeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["4"]>
>["attachNode"];
export type ReplaceNodeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["5"]>
>["replaceNode"];
export type CreateNoteAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["6"]>
>["createNote"];
export type AttachNoteAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["7"]>
>["attachNote"];
export type CreateStakeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["8"]>
>["createStake"];
export type UpdateStakeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["9"]>
>["updateStake"];
export type CloseStakeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["10"]>
>["closeStake"];
export type MoveNoteAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["11"]>
>["moveNote"];
export type ReplaceNoteAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["12"]>
>["replaceNote"];
export type SetBribeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["13"]>
>["setBribe"];
export type ClaimBribeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["14"]>
>["claimBribe"];

export type NewTreeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["0"]>["data"]
>;
export type NewNodeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["1"]>["data"]
>;
export type NewAttachedNoteEvent = Partial<
  Event<DippiesIndexProtocol["events"]["2"]>["data"]
>;
export type UpdatedStakeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["3"]>["data"]
>;
export type UpdatedBribeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["4"]>["data"]
>;
