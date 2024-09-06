import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameState {
  'currentPlayerIndex' : bigint,
  'winner' : [] | [bigint],
  'players' : Array<Player>,
}
export interface Player { 'id' : bigint, 'position' : bigint }
export interface _SERVICE {
  'checkWinCondition' : ActorMethod<[], [] | [bigint]>,
  'getCurrentPlayer' : ActorMethod<[], bigint>,
  'getGameState' : ActorMethod<[], GameState>,
  'initGame' : ActorMethod<[bigint], GameState>,
  'movePlayer' : ActorMethod<[bigint], GameState>,
  'rollDice' : ActorMethod<[], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
