export const idlFactory = ({ IDL }) => {
  const Player = IDL.Record({ 'id' : IDL.Nat, 'position' : IDL.Nat });
  const GameState = IDL.Record({
    'currentPlayerIndex' : IDL.Nat,
    'winner' : IDL.Opt(IDL.Nat),
    'players' : IDL.Vec(Player),
  });
  return IDL.Service({
    'checkWinCondition' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'getCurrentPlayer' : IDL.Func([], [IDL.Nat], ['query']),
    'getGameState' : IDL.Func([], [GameState], ['query']),
    'initGame' : IDL.Func([IDL.Nat], [GameState], []),
    'movePlayer' : IDL.Func([IDL.Nat], [GameState], []),
    'rollDice' : IDL.Func([], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
