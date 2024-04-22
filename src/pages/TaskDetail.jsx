import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../const';
import { useCookies } from 'react-cookie';

export const TaskDetail = () => {
  const { listId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [cookies] = useCookies();

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data); // APIレスポンスをコンソールに表示
        setTask(res.data);
      })
      .catch((err) => {
        setError(err.response ? err.response.status : 'Network error');
        setTask(null);
      });
  }, [listId, taskId]);

  useEffect(() => {
    console.log(task); // taskステートの値が変更されるたびにコンソールに表示
  }, [task]);

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

  if (error) {
    return <div>エラーが発生しました。エラーコード：{error}</div>;
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>タスク詳細</h2>
      <p>タイトル：{task.title}</p>
      <p>詳細：{task.detail}</p>
      <p>完了：{task.done ? '完了' : '未完了'}</p>
      <p>
        期限:
        {task.limit ? new Date(task.limit).toLocaleString('ja-JP') : '未設定'}
      </p>
      <p>
        残り時間: {task.limit ? calculateRemainingTime(task.limit) : '未設定'}
      </p>
      <Link to={`/lists/${listId}/tasks/${task.id}/edit`}>
        <button>タスクを編集</button>
      </Link>
    </div>
  );
};
