export type CustomError =
  | StringTooLong
  | NodeFull
  | NodeNotFull
  | NotAChild
  | AlreadyAChild
  | NotEnoughStake
  | InvalidNode
  | TagsMismatch
  | NotChildNote
  | NotOnNode
  | AlreadyOnNode

export class StringTooLong extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "StringTooLong"
  readonly msg = "Given string is too long"

  constructor(readonly logs?: string[]) {
    super("6000: Given string is too long")
  }
}

export class NodeFull extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "NodeFull"
  readonly msg = "Node is already full"

  constructor(readonly logs?: string[]) {
    super("6001: Node is already full")
  }
}

export class NodeNotFull extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "NodeNotFull"
  readonly msg = "Node is not full yet"

  constructor(readonly logs?: string[]) {
    super("6002: Node is not full yet")
  }
}

export class NotAChild extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "NotAChild"
  readonly msg = "Target node is not a child"

  constructor(readonly logs?: string[]) {
    super("6003: Target node is not a child")
  }
}

export class AlreadyAChild extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "AlreadyAChild"
  readonly msg = "Target node is already a child"

  constructor(readonly logs?: string[]) {
    super("6004: Target node is already a child")
  }
}

export class NotEnoughStake extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "NotEnoughStake"
  readonly msg = "Not enough stake to replace"

  constructor(readonly logs?: string[]) {
    super("6005: Not enough stake to replace")
  }
}

export class InvalidNode extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "InvalidNode"
  readonly msg = "Invalid node"

  constructor(readonly logs?: string[]) {
    super("6006: Invalid node")
  }
}

export class TagsMismatch extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "TagsMismatch"
  readonly msg = "Tags do not match"

  constructor(readonly logs?: string[]) {
    super("6007: Tags do not match")
  }
}

export class NotChildNote extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "NotChildNote"
  readonly msg = "Target note is not a child of the node"

  constructor(readonly logs?: string[]) {
    super("6008: Target note is not a child of the node")
  }
}

export class NotOnNode extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "NotOnNode"
  readonly msg = "Target note is not attached to the node"

  constructor(readonly logs?: string[]) {
    super("6009: Target note is not attached to the node")
  }
}

export class AlreadyOnNode extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "AlreadyOnNode"
  readonly msg = "Target note is already on the node"

  constructor(readonly logs?: string[]) {
    super("6010: Target note is already on the node")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new StringTooLong(logs)
    case 6001:
      return new NodeFull(logs)
    case 6002:
      return new NodeNotFull(logs)
    case 6003:
      return new NotAChild(logs)
    case 6004:
      return new AlreadyAChild(logs)
    case 6005:
      return new NotEnoughStake(logs)
    case 6006:
      return new InvalidNode(logs)
    case 6007:
      return new TagsMismatch(logs)
    case 6008:
      return new NotChildNote(logs)
    case 6009:
      return new NotOnNode(logs)
    case 6010:
      return new AlreadyOnNode(logs)
  }

  return null
}
