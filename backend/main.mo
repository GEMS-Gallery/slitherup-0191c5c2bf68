import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Int "mo:base/Int";

actor {
  type Player = {
    id: Nat;
    position: Nat;
  };

  type GameState = {
    players: [Player];
    currentPlayerIndex: Nat;
    winner: ?Nat;
  };

  let boardSize : Nat = 100;
  let snakesAndLadders : [(Nat, Nat)] = [
    (16, 6), (47, 26), (49, 11), (56, 53), (62, 19),
    (64, 60), (87, 24), (93, 73), (95, 75), (98, 78),
    (1, 38), (4, 14), (9, 31), (21, 42), (28, 84),
    (36, 44), (51, 67), (71, 91), (80, 100)
  ];

  stable var gameState : GameState = {
    players = [];
    currentPlayerIndex = 0;
    winner = null;
  };

  public func initGame(numPlayers : Nat) : async GameState {
    let players = Array.tabulate<Player>(numPlayers, func(i) {
      { id = i; position = 1 }
    });
    gameState := {
      players = players;
      currentPlayerIndex = 0;
      winner = null;
    };
    gameState
  };

  public func rollDice() : async Nat {
    let seed = await Random.blob();
    let roll = Random.rangeFrom(6, seed) + 1;
    roll
  };

  public func movePlayer(roll : Nat) : async GameState {
    let currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var newPosition = currentPlayer.position + roll;

    if (newPosition > boardSize) {
      newPosition := boardSize - (newPosition - boardSize);
    };

    newPosition := checkSnakesAndLadders(newPosition);

    let updatedPlayer = { id = currentPlayer.id; position = newPosition };
    let updatedPlayers = Array.tabulate<Player>(gameState.players.size(), func(i) {
      if (i == gameState.currentPlayerIndex) updatedPlayer else gameState.players[i]
    });

    gameState := {
      players = updatedPlayers;
      currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.size();
      winner = if (newPosition == boardSize) ?currentPlayer.id else null;
    };

    gameState
  };

  private func checkSnakesAndLadders(position : Nat) : Nat {
    switch (Array.find<(Nat, Nat)>(snakesAndLadders, func((start, _)) { start == position })) {
      case (?(_, end)) { end };
      case null { position };
    }
  };

  public query func getGameState() : async GameState {
    gameState
  };

  public query func getCurrentPlayer() : async Nat {
    gameState.currentPlayerIndex
  };

  public query func checkWinCondition() : async ?Nat {
    gameState.winner
  };
}
