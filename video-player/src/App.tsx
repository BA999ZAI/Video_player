import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const url = 'https://www.mocky.io/v2/5e60c5f53300005fcc97bbdd';
  const [event, setEvent] = useState([]);
 
  //Отправка запроса, получение данных и сортировка событий по возрастанию времени
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then((result) => {
        result.sort((a:any, b:any) => a['timestamp'] - b['timestamp']);
        setEvent(result);
      })
      .catch (error => console.log(error));
  }, [])

  //Конвертация миллисекунд в формат ММ:СС:ссс
  const convertTime = (timestamp:number, result = '') => {
    //addMinuts
    result = `0${String(Math.floor(timestamp / 1000 / 60))}:`;

    //addSeconds
    const seconds = String(Math.floor(timestamp / 1000 % 60));
    for (let i = seconds.length - 2; i < seconds.length; i++) { result += (seconds[i] === undefined) ? 0 : seconds[i]; }
    result += ':';

    //addMilliseconds
    const milliseconds = String(timestamp);
    for (let i = milliseconds.length - 3; i < milliseconds.length; i++) { result += (milliseconds[i] === undefined) ? 0 : milliseconds[i]; }

    return result;
  };

  // При нажатие на событие видео переноситься на нужный момент
  const onAddEvent = (time: number) => {
    (document.getElementById('video') as HTMLMediaElement).currentTime = time / 1000;
  };

  // Отображение зеленый прямоугольников по событиям
  const onPlaying = async(timeNow: number) => {
    for (let i = 0; i < event.length; i++) {

      const timestamp = Number((event[i]['timestamp'] / 1000).toFixed(1));
      timeNow = Number(timeNow.toFixed(1));

      if (timestamp-0.135 <= timeNow && timeNow <= timestamp+0.135) {

        const elem = (document.getElementById(event[i]['id']) as HTMLElement).style;
        elem.zIndex = '1';
        elem.backgroundColor = 'green';
        
        setTimeout(function() {
          elem.zIndex = '-1';
          elem.backgroundColor = 'black';
        }, event[i]['duration']);
      }
    }
  };

  return (
    <div className="App">
      <div className="videoBlock">

        <video id='video' onTimeUpdateCapture={(event) => onPlaying(event.currentTarget.currentTime)} controls autoPlay muted width='100%'>
          <source src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' type='video/mp4' />
        </video>
        
        {event.map((item, key) => {
          return (
            <div key={key} id={item['id']} style={{position: 'absolute', zIndex: -1, left: item['zone']['left'], top: item['zone']['top'],width: item['zone']['width'], height: item['zone']['height']}} />
          )
        })}

      </div>

      <div className="allEvent">
        
        {event.map((item, key) => {
          return (
            <p className="timestamp" key={key} onClick={() => onAddEvent(item['timestamp'])}>
              {convertTime(item['timestamp'])}<br/>----------<br/>{convertTime(item['timestamp'] + item['duration'])}
            </p>
          );
        })}
      
      </div>
    </div>
  );
}

export default App();