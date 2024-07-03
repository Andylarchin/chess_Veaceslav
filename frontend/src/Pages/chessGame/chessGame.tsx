import React, { useEffect, useState } from 'react';
import { gameSubject, initGame, resetGame, getMoves } from '../../Game';
import './style.css';
import BoardSquare from '../../components/BoardSquare/BoardSquare';
import {
  ClockCircleOutlined,
  RetweetOutlined,
  SettingOutlined,
  SmileOutlined,
  SendOutlined,
  FlagOutlined,
  StepBackwardOutlined,
  LeftOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  RightOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Game {
  board: string[][];
  isGameOver: boolean;
  result: string | null;
  turn: 'w' | 'b';
}

interface Move {
  fromMove: { from: string };
  toMove: { to: string };
}

interface Message {
  message: string;
}

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [currentBoard, setCurrentBoard] = useState<string[]>([]);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [movesList, setMovesList] = useState<Move[]>([]);
  const [message, setMessage] = useState<Message[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Message>();

  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe((game: Game) => {
      if (game) {
        setBoard(game.board);
        setIsGameOver(game.isGameOver);
        setResult(game.result);
        setTurn(game.turn);
      }
    });
    return () => subscribe.unsubscribe();
  }, []);

  useEffect(() => {
    const movesData = getMoves();
    setMovesList((movesList) => [...movesList, movesData]);

    console.log(movesList);

    if (isGameOver) {
      setMovesList([]);
    }
  }, [turn, isGameOver]);

  useEffect(() => {
    setCurrentBoard(turn === 'w' ? board.flat() : board.flat().reverse());
  }, [board, turn]);

  const getXYPosition = (i: number): { x: number; y: number } => {
    const x = turn === 'w' ? i % 8 : Math.abs((i % 8) - 7);
    const y =
      turn === 'w' ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
    return { x, y };
  };

  const isBlack = (i: number): boolean => {
    const { x, y } = getXYPosition(i);
    return (x + y) % 2 === 1;
  };

  const getPosition = (i: number): string => {
    const { x, y } = getXYPosition(i);
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
    return `${letter}${y + 1}`;
  };

  const onSubmit: SubmitHandler<Message> = (data) => {
    setMessage((message) => [...message, data]);
    console.log(data);
    (document.getElementById('messageInput') as HTMLInputElement).value = '';
  };

  return (
    <>
      <div className='container'>
        <div className='movesContainer'>
          <div className='topChat'>
            <p className='firstHalf'>Moves</p>
            <p className='secondHalf' style={{ fontSize: '25px' }}>
              <StepBackwardOutlined />
              <LeftOutlined />
              <StepForwardOutlined />
              <RightOutlined />
              <CaretRightOutlined />
            </p>
          </div>
          <p className='gameType'>
            <BookOutlined />
            Italian Game - Rouseeau Gabmit
          </p>
          <div className='movesList'>
            {movesList
              .filter((item) => item.fromMove !== undefined)
              .map((move, i) => {
                if (i % 2 === 0) {
                  return (
                    <div className='opponentMove' key={i}>
                      <p>{`${i + 1}.`}</p>
                      <p>{move.fromMove.from}</p>
                      <p>{move.toMove.to}</p>
                    </div>
                  );
                } else {
                  return (
                    <div className='ownMove' key={i}>
                      <p>{`${i + 1}.`}</p>
                      <p>{move.fromMove.from}</p>
                      <p>{move.toMove.to}</p>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        {isGameOver && (
          <div>
            <h2 className='vertical-text'>
              GAME OVER
              <button onClick={resetGame}>
                <span className='vertical-text'>NEW GAME</span>
              </button>
            </h2>
          </div>
        )}
        <div className='board-container'>
          <div className='board'>
            {currentBoard.map((piece, i) => {
              return (
                <div key={i} className='square'>
                  <BoardSquare
                    piece={piece}
                    black={isBlack(i)}
                    position={getPosition(i)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {result && <p className='vertical-text'>{result}</p>}

        <div className='chatContainer'>
          <div className='opponentName'>
            <div
              style={{
                marginTop: '13%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '15px',
                color: '#e1e1e1',
              }}
            >
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1P_ahGnzn0M0nsKJzASMplSBNbzh6528og&s'
                style={{ width: '45px', height: '45px' }}
              ></img>
              <p>Andylarchin</p>
            </div>
            <div
              style={{
                marginTop: '13%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '15px',
                color: '#e1e1e1',
              }}
            >
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1P_ahGnzn0M0nsKJzASMplSBNbzh6528og&s'
                style={{ width: '45px', height: '45px' }}
              ></img>
              <p>ChessPlayerTwo</p>
            </div>
          </div>
          <div className='chat'>
            <div className='topChat'>
              <p className='firstHalf'>Chat</p>
              <p className='secondHalf'>
                <RetweetOutlined />
                <SettingOutlined />
              </p>
            </div>
            <div className='actualChat'>
              <p style={{ margin: '10px', color: 'grey' }}>
                Game has started with ChessPlayerTwo
              </p>

              {message.map((m, i) => {
                if (i % 2 === 0) {
                  return (
                    <div className='message' key={i}>
                      <img
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1P_ahGnzn0M0nsKJzASMplSBNbzh6528og&s'
                        style={{ width: '45px', height: '45px' }}
                      ></img>
                      <p>{m.message}</p>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className='message'
                      style={{ justifyContent: 'flex-end' }}
                      key={i}
                    >
                      <p>{m.message}</p>
                      <img
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1P_ahGnzn0M0nsKJzASMplSBNbzh6528og&s'
                        style={{ width: '45px', height: '45px' }}
                      ></img>
                    </div>
                  );
                }
              })}
            </div>
            <div className='sendMessage'>
              <div className='chatLog'>
                <form
                  style={{ color: 'white', width: '100%', height: '100%' }}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <input
                    placeholder='Enter a message!'
                    {...register('message')}
                    id='messageInput'
                  ></input>
                </form>
              </div>
              <button className='sendButton' type='submit'>
                <SendOutlined />
              </button>
            </div>

            <div className='gameChoice'>
              <div className='choiceButton'>Draw</div>
              <div className='choiceButton2'>
                <FlagOutlined />
                Surrender
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChessGame;
