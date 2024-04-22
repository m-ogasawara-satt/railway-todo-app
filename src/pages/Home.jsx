import React, { useState, useEffect } from 'react'; // Reactとそのフックをインポート
import { Link } from 'react-router-dom'; // ルーティング用のLinkコンポーネントをインポート
import { useCookies } from 'react-cookie'; // クッキーを操作するためのフックをインポート
import axios from 'axios'; // HTTPリクエストを行うためのライブラリをインポート
import { Header } from '../components/Header'; // Headerコンポーネントをインポート
import { url } from '../const'; // APIのURLをインポート
import './home.scss'; // スタイルシートをインポート

// Homeコンポーネントを定義
export const Home = () => {
  // 状態変数を定義
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo'); // タスクの表示状態を管理
  const [lists, setLists] = useState([]); // リストのデータを管理
  const [selectListId, setSelectListId] = useState(); // 選択されたリストのIDを管理
  const [tasks, setTasks] = useState([]); // タスクのデータを管理
  const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージを管理
  const [cookies] = useCookies(); // クッキーを取得

  // タスクの表示状態を変更するハンドラを定義
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data); // 取得したリストを状態に設定
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`); // エラーメッセージを設定
      });
  }, []);

  // 選択されたリストが変更されたときにタスクを取得
  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== 'undefined') {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks); // 取得したタスクを状態に設定
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`); // エラーメッセージを設定
        });
    }
  }, [lists]);

  // リストを選択するハンドラを定義
  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks); // 取得したタスクを状態に設定
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`); // エラーメッセージを設
      });
  };

  // コンポーネントをレンダリング
  return (
    <div>
      <Header /> {/* Headerコンポーネントをレンダリング */}
      <main className="taskList">
        {/* エラーメッセージを表示 */}
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            {/* リスト一覧の見出しを表示 */}
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                {/* リスト作成ページへのリンクを表示 */}
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                {/* 選択中のリストの編集ページへのリンクを表示 */}
                <Link to={`/lists/${selectListId}/edit`}>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab">
            {/* 現在選択中のリストかどうかを判定 */}
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              {
                /* リストをクリックしたときの処理を定義 */
              }
              return (
                <li
                  key={key}
                  // 選択中のリストの場合はactiveクラスを追加
                  className={`list-tab-item ${isActive ? 'active' : ''}`}
                  // リストをクリックしたときの処理を定義
                  onClick={() => handleSelectList(list.id)}
                >
                  {/* リストのタイトルを表示 */}
                  {list.title}
                </li>
              );
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              {/* タスク作成ページへのリンクを表示 */}
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              {/* 選択肢が変更されたときの処理を定義 */}
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                {/* 未完了のタスクを表示する選択肢を定義 */}
                <option value="done">完了</option>
                {/* 完了したタスクを表示する選択肢を定義 */}
              </select>
            </div>
            {/* Tasksコンポーネントをレンダリングし、タスクの一覧を表示 */}
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

function calculateRemainingTime(limit) {
  const now = Date.now();
  const deadline = new Date(limit).getTime();
  const remainingTimeInMilliseconds = deadline - now;

  if (remainingTimeInMilliseconds <= 0) {
    return '期限切れ';
  }

  const remainingTimeInMinutes = Math.floor(
    remainingTimeInMilliseconds / 1000 / 60
  );
  const hours = Math.floor(remainingTimeInMinutes / 60);
  const minutes = remainingTimeInMinutes % 60;

  return `${hours}時間${minutes}分`;
}

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  const renderTask = (task, key) => {
    return (
      <li key={key} className="task-item">
        <Link
          to={`/lists/${selectListId}/tasks/${task.id}/detail`}
          className="task-item-link"
        >
          {task.title}
          <br />
          {task.done ? '完了' : '未完了'}
          <br />
          期限: {task.limit ? new Date(task.limit).toLocaleString() : '未設定'}
          <br />
          残り時間: {task.limit ? calculateRemainingTime(task.limit) : '未設定'}
        </Link>
      </li>
    );
  };

  if (isDoneDisplay == 'done') {
    return (
      <ul>{tasks.filter((task) => task.done === true).map(renderTask)}</ul>
    );
  }

  return <ul>{tasks.filter((task) => task.done === false).map(renderTask)}</ul>;
};
