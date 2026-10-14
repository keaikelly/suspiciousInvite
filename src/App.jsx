import React, { useEffect, useRef, useState } from 'react';
import { content as c } from './content.js';
import './App.css';
import { Sprite, World, Npc } from './PixelArt.jsx';
import ribbonImage from './assets/ribbon.png';

const refusal = [
  '흥!!!',
  '마우스 고장인가요? 다시 확인하세요!',
  '답변을 정정할 기회를 드립니다.ㅜ',
  '네. 못 본 걸로 할게요. 다시!',
];
function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 40 }, (_, i) => (
        <i
          key={i}
          style={{
            '--x': `${(i * 37) % 100}%`,
            '--delay': `${(i % 7) * 0.13}s`,
            '--color': ['#ed633d', '#ecc95b', '#47664b', '#ecb8ac'][i % 4],
          }}
        />
      ))}
    </div>
  );
}
export default function App() {
  const [step, setStep] = useState(0),
    [name, setName] = useState(''),
    [dob, setDob] = useState(''),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(false),
    [modal, setModal] = useState(null),
    [noCount, setNoCount] = useState(0),
    [q, setQ] = useState(0),
    [feedback, setFeedback] = useState(''),
    [correct, setCorrect] = useState(false),
    [opened, setOpened] = useState(false);
  const dialog = useRef(null),
    timer = useRef(null),
    heading = useRef(null),
    audio = useRef(null);
  const [sound, setSound] = useState(false);
  function beep() {
    if (!sound) return;
    try {
      const A = window.AudioContext || window.webkitAudioContext;
      if (!A) return;
      audio.current ??= new A();
      const a = audio.current;
      void a.resume();
      const o = a.createOscillator(),
        g = a.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(580, a.currentTime);
      o.frequency.setValueAtTime(780, a.currentTime + 0.06);
      g.gain.setValueAtTime(0.035, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.14);
      o.connect(g);
      g.connect(a.destination);
      o.start();
      o.stop(a.currentTime + 0.15);
    } catch {}
  }
  const recipient = c.recipient || name || '오늘의 주인공';
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (modal && !dialog.current.open) dialog.current.showModal();
    if (!modal && dialog.current.open) dialog.current.close();
  }, [modal]);
  function go(n) {
    setStep(n);
    setError('');
    setFeedback('');
  }
  function ask(kind) {
    setNoCount(0);
    setModal(kind);
  }
  function accept() {
    const kind = modal;
    setModal(null);
    if (kind === 'invite') go(1);
    if (kind === 'gift') go(5);
    if (kind === 'love') go(6);
  }
  function submit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('이름을 알려주셔야 명단을 찾죠!');
      return;
    }
    if (!dob || dob > new Date().toISOString().slice(0, 10)) {
      setError('생년월일을 다시 확인해주세요.');
      return;
    }
    if (c.birthday && dob !== c.birthday) {
      setError('명단의 생년월일과 달라요. 다시 확인해주세요.');
      return;
    }
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      go(2);
    }, 2000);
  }
  function answer(i) {
    if (correct) return;
    if (i === c.questions[q].answer) {
      setCorrect(true);
      setFeedback('정답! 역시 조금은 알고 계시는군요 😏');
    } else setFeedback('땡! 다시 골라봐요. 힌트: ' + c.questions[q].hint);
  }
  function next() {
    setQ(q + 1);
    setCorrect(false);
    setFeedback('');
  }
  function reset() {
    clearTimeout(timer.current);
    setLoading(false);
    setModal(null);
    setError('');
    setStep(0);
    setQ(0);
    setCorrect(false);
    setOpened(false);
    setFeedback('');
    setNoCount(0);
  }
  const titles = [
    '수상한 초대장',
    '수신인 확인',
    '생일자 발견!',
    '오늘의 주인공',
    '특별 제안',
    '자격 확인',
    '수령 완료',
  ];
  return (
    <div
      onClick={(e) => {
        if (e.target.closest('button')) beep();
      }}
      className={`site pixel-site ${step === 2 ? 'celebration' : ''}`}
    >
      <header>
        <button className="brand" onClick={reset}>
          수상한 초대장<span>PIXEL QUEST · VOL. 01</span>
        </button>
        <button
          className="sound-toggle"
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          SOUND {sound ? 'ON' : 'OFF'}
        </button>
      </header>
      <main>
        <div className="topline">
          <span>
            <span className="hud-hearts">♥ ♥ ♥</span> PLAYER 01
          </span>
          <span>{String(step + 1).padStart(2, '0')} / 07</span>
        </div>
        <section className="scene" key={step}>
          <h1 className="sr-only" tabIndex={-1} ref={heading}>
            {titles[step]}
          </h1>
          {step === 0 && (
            <div className="title-screen">
              <World />
              <div className="title-overlay">
                <div className="eyebrow">A SMALL, SUSPICIOUS ADVENTURE</div>
                <h2>
                  수상한
                  <br />
                  <em>초대장</em>
                </h2>
                <span className="title-badge">발신인 불명 · 수신인 한정</span>
              </div>
              <div className="start-controls">
                <button className="primary start" onClick={() => go(1)}>
                  ▶ START GAME
                </button>
                <button className="text-button" onClick={() => ask('invite')}>
                  초대장을 거절한다
                </button>
              </div>
              <Npc>
                당신 앞으로 편지가 한 통 도착했습니다.
                <br />
                누가 보냈냐고요? 일단 시작해보시죠.
              </Npc>
            </div>
          )}
          {step === 1 && (
            <div className="narrow">
              <div className="eyebrow">PLAYER REGISTRATION</div>
              <h2>
                <em>플레이어</em> 등록
              </h2>
              <p>모험을 시작하기 전에, 당신에 대해 알려주세요.</p>
              <form className="form-card" onSubmit={submit}>
                <label>
                  이름
                  <input
                    autoComplete="off"
                    maxLength={30}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    required
                    disabled={loading}
                  />
                </label>
                <label>
                  생년월일
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    disabled={loading}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </label>
                <p className="feedback" role="status">
                  {loading ? '명단 확인 중… 어? 잠깐만요.' : error}
                </p>
                <button className="primary wide" disabled={loading}>
                  {loading ? '확인 중…' : '명단 확인하기 →'}
                </button>
                <div className="fine">
                  입력 내용은 서버로 전송하거나 저장하지 않아요.
                </div>
              </form>
            </div>
          )}
          {step === 2 && (
            <div className="narrow birthday">
              <Confetti />
              <div className="eyebrow">★ HIDDEN EVENT UNLOCKED ★</div>
              <div className="oval">히든 이벤트 발견!</div>
              <h2>
                <em>생일이시군요</em>
                <br />
                !!!!!!!!!!!!!!
              </h2>
              <div className="birthday-pixels">
                <Sprite name="courier" />
                <Sprite name="cake" />
                <Sprite name="hero" />
              </div>
              <p>
                <strong>{recipient}님, 딱 걸리셨습니다.</strong>
                <br />
                지금부터 생일자 특별 전형으로 전환합니다.
              </p>
              <button className="primary" onClick={() => go(3)}>
                오늘의 주인공 확인하기 →
              </button>
              <div className="fine">
                우연인 척했지만 사실 다 계획이었습니다.
              </div>
            </div>
          )}
          {step === 3 && (
            <>
              <div className="eyebrow">CHARACTER PROFILE · SPECIAL GUEST</div>
              <Sprite name="hero" className="profile-hero" />
              <h2>
                오늘의 생일자,
                <br />
                <em>{recipient}</em>님을 소개합니다.
              </h2>
              <p>
                주최자 {c.author}의 아주 주관적인 선정 사유입니다. 이의는 받지
                않습니다.
              </p>
              <div className="traits">
                {c.traits.map((t, i) => (
                  <article key={i}>
                    <small>PASSIVE SKILL 0{i + 1}</small>
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                    <div className="stat-bar">
                      <span style={{ width: `${[96, 92, 100][i % 3]}%` }} />
                    </div>
                  </article>
                ))}
              </div>
              <div className="memories-heading">
                <h3>추억 도감</h3>
                <span>COLLECTION · 함께한 순간들</span>
              </div>
              <div className="memories">
                {c.memories.map((m, i) => (
                  <figure key={i}>
                    <div className="photo">
                      {m.src ? (
                        <img src={m.src} alt={m.caption} />
                      ) : (
                        <>
                          <Sprite name={i % 2 === 0 ? 'tree' : 'mailbox'} />
                          <small>MEMORY 0{i + 1} · 사진을 넣어주세요</small>
                        </>
                      )}
                    </div>
                    <figcaption>{m.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <div className="center">
                <button className="primary" onClick={() => go(4)}>
                  소개 잘 들었습니다. 다음! →
                </button>
              </div>
            </>
          )}
          {step === 4 && (
            <div className="narrow">
              <div className="eyebrow">NPC EVENT · SPECIAL OFFER</div>
              <h2>
                그래서,
                <br />
                <em>선물</em>을 받으시겠습니까?
              </h2>
              <Sprite name="courier" className="offer-npc" />
              <Npc>
                정성껏 준비한 선물입니다.
                <br />
                받으시겠습니까? 대답은 신중하게.
              </Npc>
              <div className="actions center">
                <button className="primary" onClick={() => go(5)}>
                  ▶ 받는다
                </button>
                <button className="text-button" onClick={() => ask('gift')}>
                  거절한다
                </button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="narrow">
              <div className="eyebrow">QUEST · UNLOCK THE CHEST</div>
              <h2>
                그렇다면,
                <br />
                <em>퀴즈를 풀어주세요.</em>
              </h2>
              <p>선물이 그렇게 쉽게 나올 리가 없죠 😏</p>
              <div className="quiz">
                <div className="quiz-top">
                  <span>상자 잠금 해제</span>
                  <span>
                    {Math.min(q + 1, c.questions.length + 1)} /{' '}
                    {c.questions.length + 1}
                  </span>
                </div>
                <div className="progress">
                  <span
                    style={{
                      width: `${(q / (c.questions.length + 1)) * 100}%`,
                    }}
                  />
                </div>
                {q < c.questions.length ? (
                  <>
                    <h3>{c.questions[q].question}</h3>
                    <div className="choices">
                      {c.questions[q].options.map((o, i) => (
                        <button
                          key={i}
                          disabled={correct}
                          className={
                            correct && i === c.questions[q].answer
                              ? 'right'
                              : ''
                          }
                          onClick={() => answer(i)}
                        >
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          {o}
                        </button>
                      ))}
                    </div>
                    <p className="feedback" role="status">
                      {feedback}
                    </p>
                    {correct && (
                      <button className="primary wide" onClick={next}>
                        다음 문제 →
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <h3>
                      이 게임의 제작자를
                      <br />
                      엄청 좋아하시나요?
                    </h3>
                    <Sprite name="heart" className="love-heart" />
                    <div className="actions center">
                      <button className="primary" onClick={() => go(6)}>
                        당연하죠 ♡
                      </button>
                      <button
                        className="text-button"
                        onClick={() => ask('love')}
                      >
                        아니요
                      </button>
                    </div>
                    <div className="fine">
                      신중하게 답변해주세요. 정답은 하나입니다.
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="narrow">
              <div className="eyebrow">QUEST COMPLETE</div>
              <h2>
                퀘스트 완료!
                <br />
                <em>선물 획득!</em>
              </h2>
              <p>
                사실 틀려도 주려고 했지만.
                <br />
                끝까지 함께해줘서 고마워!
              </p>
              {!opened ? (
                <>
                  <button
                    className="gift-button"
                    aria-label="선물 상자 열기"
                    onClick={() => setOpened(true)}
                  >
              <img
                src="/chest.svg"
                className="sprite reward-chest"
                alt="선물 상자"
              />                  </button>
                  <div className="fine">상자를 눌러 열어보세요 ↗</div>
                </>
              ) : (
                <div className="gift-result">
                  <Confetti />
                  <img
                    className="gift-photo"
                    src={ribbonImage}
                    alt="선물은 바로 나 🎀"
                  />  
                  <h3>{c.gift.title}</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{c.gift.message}</p>
                  <div className="signature">FROM. {c.author} ♡</div>
                </div>
              )}
              <button className="text-button restart" onClick={reset}>
                처음부터 다시 보기 ↺
              </button>
            </div>
          )}
        </section>
      </main>
      <footer>
        <span>수상하지만 해롭지는 않습니다.</span>
        <span>NO SAVE POINT · JUST FOR YOU</span>
      </footer>
      {c.demo && (
        <div className="demo">체험용 시안 · 장점과 퀴즈는 예시입니다</div>
      )}
      <dialog
        ref={dialog}
        onCancel={() => setModal(null)}
        onClose={() => setModal(null)}
      >
        <button
          className="close"
          aria-label="창 닫기"
          onClick={() => setModal(null)}
        >
          ×
        </button>
        <Sprite name="courier" className="modal-npc" />
        <h3>{refusal[Math.min(noCount, refusal.length - 1)]}</h3>
        <p>
          {modal === 'invite'
            ? '다시 묻겠습니다. 초대장을 열어보시겠어요?'
            : modal === 'gift'
            ? '다시 묻겠습니다. 선물을 받으시겠어요?'
            : '다시 묻겠습니다. 출제자를 좋아하시나요?'}
        </p>
        <button className="primary wide" onClick={accept}>
          {modal === 'love' ? '당연히 좋아하죠 ♡' : '네! 알겠습니다'}
        </button>
        <button
          className="text-button"
          onClick={() => setNoCount((n) => n + 1)}
        >
          아직도 아니요
        </button>
      </dialog>
    </div>
  );
}
