'use client';

import { useEffect, useMemo, useState } from 'react';

const starterQuestions = [
  { id: 'f1', unit: '분수의 나눗셈', topic: '분수 ÷ 자연수', difficulty: 1, prompt: '3/4 ÷ 3의 값은 무엇일까요?', options: ['1/4', '3/7', '9/4', '1'], answer: '1/4', hint1: '나누는 수 3을 분모에 곱해 보세요.', hint2: '3/4 ÷ 3 = 3/(4×3) 입니다.', explanation: '자연수로 나눌 때는 분모에 그 수를 곱합니다. 3/4 ÷ 3 = 3/12 = 1/4입니다.' },
  { id: 'f2', unit: '분수의 나눗셈', topic: '자연수 ÷ 분수', difficulty: 2, prompt: '2 ÷ 1/4의 값은 무엇일까요?', options: ['1/2', '2', '6', '8'], answer: '8', hint1: '2 안에 1/4가 몇 개 들어가는지 생각해 보세요.', hint2: '2는 8/4와 같습니다.', explanation: '2는 8/4이므로 1/4가 8개 들어갑니다. 따라서 2 ÷ 1/4 = 8입니다.' },
  { id: 'f3', unit: '분수의 나눗셈', topic: '분수 ÷ 분수', difficulty: 2, prompt: '2/3 ÷ 4/5의 값은 무엇일까요?', options: ['3/10', '5/6', '8/15', '1과 1/6'], answer: '5/6', hint1: '나누는 분수를 뒤집어 곱하는 방법을 떠올려 보세요.', hint2: '2/3 × 5/4로 바꿀 수 있습니다.', explanation: '분수로 나눌 때는 나누는 수의 분자와 분모를 바꾸어 곱합니다. 2/3 × 5/4 = 10/12 = 5/6입니다.' },
  { id: 'f4', unit: '분수의 나눗셈', topic: '몫의 의미', difficulty: 3, prompt: '3/4 L의 주스를 1/8 L씩 나누면 몇 컵이 될까요?', options: ['4컵', '5컵', '6컵', '8컵'], answer: '6컵', hint1: '전체 양에 한 컵의 양이 몇 번 들어가는지 구합니다.', hint2: '3/4 ÷ 1/8 = 6입니다.', explanation: '3/4 L 안에는 1/8 L가 6번 들어갑니다. 따라서 6컵으로 나눌 수 있습니다.' },
  { id: 'v1', unit: '직육면체의 부피', topic: '부피 구하기', difficulty: 1, prompt: '가로 4cm, 세로 3cm, 높이 2cm인 직육면체의 부피는?', options: ['9cm³', '18cm³', '24cm³', '48cm³'], answer: '24cm³', hint1: '부피는 가로 × 세로 × 높이입니다.', hint2: '4 × 3 × 2를 계산해 보세요.', explanation: '직육면체의 부피는 가로 × 세로 × 높이입니다. 4 × 3 × 2 = 24이므로 24cm³입니다.' },
  { id: 'v2', unit: '직육면체의 부피', topic: '들이와 부피', difficulty: 2, prompt: '한 모서리가 5cm인 정육면체의 부피는?', options: ['15cm³', '25cm³', '75cm³', '125cm³'], answer: '125cm³', hint1: '정육면체는 가로, 세로, 높이가 모두 같습니다.', hint2: '5 × 5 × 5를 계산해 보세요.', explanation: '정육면체의 부피는 한 모서리의 길이를 세 번 곱합니다. 5 × 5 × 5 = 125cm³입니다.' },
  { id: 'v3', unit: '직육면체의 부피', topic: '부피 비교', difficulty: 3, prompt: '가로 6cm, 세로 4cm, 높이 5cm인 상자의 부피는?', options: ['60cm³', '100cm³', '120cm³', '150cm³'], answer: '120cm³', hint1: '세 길이를 모두 곱하면 됩니다.', hint2: '6 × 4 = 24, 그다음 5를 곱해 보세요.', explanation: '6 × 4 × 5 = 120이므로 상자의 부피는 120cm³입니다.' },
  { id: 'v4', unit: '직육면체의 부피', topic: '부피의 활용', difficulty: 4, prompt: '부피가 96cm³이고 가로 8cm, 세로 4cm인 직육면체의 높이는?', options: ['2cm', '3cm', '4cm', '6cm'], answer: '3cm', hint1: '부피 ÷ (가로 × 세로)로 높이를 구합니다.', hint2: '96 ÷ (8 × 4)를 계산해 보세요.', explanation: '밑면의 넓이는 8 × 4 = 32cm²입니다. 96 ÷ 32 = 3이므로 높이는 3cm입니다.' },
];

const unitMeta = [
  { name: '분수의 나눗셈', icon: '÷', color: 'violet', text: '분수를 나누는 원리와 생활 속 문제를 풀어요.' },
  { name: '직육면체의 부피', icon: '▣', color: 'mint', text: '직육면체와 정육면체의 부피를 구해요.' },
  { name: '비와 비율', icon: '%', color: 'coral', text: '준비 중인 단원이에요.', locked: true },
  { name: '원의 넓이', icon: '◯', color: 'sun', text: '준비 중인 단원이에요.', locked: true },
];

const defaultProgress = {
  score: 1240,
  streak: 3,
  badges: ['첫 걸음', '분수 탐험가'],
  attempts: [],
  difficulty: { '분수의 나눗셈': 2, '직육면체의 부피': 2 },
};

function getProgress() {
  if (typeof window === 'undefined') return defaultProgress;
  try { return JSON.parse(window.localStorage.getItem('math-step-progress')) || defaultProgress; }
  catch { return defaultProgress; }
}

function saveProgress(value) {
  window.localStorage.setItem('math-step-progress', JSON.stringify(value));
}

function Pill({ children, tone = 'gray' }) { return <span className={`pill ${tone}`}>{children}</span>; }

function IconButton({ children, label, onClick }) {
  return <button className="icon-button" aria-label={label} onClick={onClick}>{children}</button>;
}

export default function Home() {
  const [mode, setMode] = useState(null);
  const [screen, setScreen] = useState('home');
  const [progress, setProgress] = useState(defaultProgress);
  const [questions, setQuestions] = useState(starterQuestions);
  const [activeUnit, setActiveUnit] = useState('분수의 나눗셈');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [choice, setChoice] = useState('');
  const [result, setResult] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => setProgress(getProgress()), []);
  useEffect(() => { if (mode === 'student') saveProgress(progress); }, [progress, mode]);

  const attemptsByUnit = (unit) => progress.attempts.filter((attempt) => attempt.unit === unit);
  const correctCount = (unit) => attemptsByUnit(unit).filter((attempt) => attempt.correct).length;
  const questionPool = useMemo(() => questions.filter((question) => question.unit === activeUnit), [questions, activeUnit]);

  function showToast(text) {
    setToast(text);
    window.setTimeout(() => setToast(''), 2400);
  }

  function openLearning(unit) {
    setActiveUnit(unit);
    const unitQuestions = questions.filter((question) => question.unit === unit);
    setActiveQuestion(unitQuestions[0]);
    setChoice('');
    setResult(null);
    setHintLevel(0);
    setScreen('learn');
  }

  function submitAnswer() {
    if (!choice || !activeQuestion) return;
    const correct = choice === activeQuestion.answer;
    setResult({ correct });
    const attempt = { id: `${activeQuestion.id}-${Date.now()}`, unit: activeUnit, questionId: activeQuestion.id, correct, hintLevel, date: new Date().toISOString() };
    setProgress((current) => ({ ...current, score: current.score + (correct ? Math.max(10, 30 - hintLevel * 8) : 5), attempts: [...current.attempts, attempt] }));
  }

  function nextQuestion() {
    const currentAttempts = [...attemptsByUnit(activeUnit), { correct: result?.correct, hintLevel }];
    let nextDifficulty = progress.difficulty[activeUnit] || 2;
    if (currentAttempts.length % 4 === 0) {
      const recent = currentAttempts.slice(-4);
      const correct = recent.filter((attempt) => attempt.correct).length;
      const hints = recent.reduce((sum, attempt) => sum + (attempt.hintLevel || 0), 0);
      if (correct >= 3 && hints <= 1) nextDifficulty = Math.min(5, nextDifficulty + 1);
      if (correct <= 1 || hints >= 3) nextDifficulty = Math.max(1, nextDifficulty - 1);
      setProgress((current) => ({ ...current, difficulty: { ...current.difficulty, [activeUnit]: nextDifficulty } }));
      showToast(`다음 4문항은 난이도 ${nextDifficulty}단계로 풀어요.`);
    }
    const currentIndex = questionPool.findIndex((question) => question.id === activeQuestion.id);
    const preferred = questionPool.find((question) => question.difficulty === nextDifficulty && question.id !== activeQuestion.id);
    const next = preferred || questionPool[(currentIndex + 1) % questionPool.length];
    setActiveQuestion(next);
    setChoice('');
    setResult(null);
    setHintLevel(0);
  }

  function logout() { setMode(null); setScreen('home'); setResult(null); }

  if (!mode) return <Welcome onEnter={(selectedMode) => { setMode(selectedMode); setScreen(selectedMode === 'teacher' ? 'dashboard' : 'home'); }} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen(mode === 'teacher' ? 'dashboard' : 'home')}><span>∑</span> 수학 한 걸음</button>
        <div className="top-actions">
          {mode === 'student' && <><span className="streak">🔥 {progress.streak}일째</span><span className="points">✦ {progress.score.toLocaleString()}점</span></>}
          <button className="avatar" aria-label="계정 메뉴" onClick={logout}>{mode === 'teacher' ? '김' : '별'}</button>
        </div>
      </header>
      {mode === 'student' ? (
        <StudentView screen={screen} setScreen={setScreen} progress={progress} units={unitMeta} openLearning={openLearning} activeUnit={activeUnit} activeQuestion={activeQuestion} choice={choice} setChoice={setChoice} result={result} hintLevel={hintLevel} setHintLevel={setHintLevel} submitAnswer={submitAnswer} nextQuestion={nextQuestion} attemptsByUnit={attemptsByUnit} correctCount={correctCount} />
      ) : (
        <TeacherView screen={screen} setScreen={setScreen} questions={questions} setQuestions={setQuestions} showForm={showForm} setShowForm={setShowForm} showToast={showToast} />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function Welcome({ onEnter }) {
  const [id, setId] = useState('s6-083');
  const [password, setPassword] = useState('••••••••');
  return <main className="welcome-shell"><div className="welcome-card"><div className="hero-mark">∑</div><p className="eyebrow">6학년 수학 복습</p><h1>오늘의 수학,<br /><em>한 걸음</em>씩.</h1><p className="welcome-copy">문제를 풀고 바로 배우는 나만의 복습 시간이에요.</p><label>학습 ID<input value={id} onChange={(event) => setId(event.target.value)} aria-label="학습 ID" /></label><label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} aria-label="비밀번호" /></label><button className="primary wide" onClick={() => onEnter('student')}>학습 시작하기 <span>→</span></button><button className="text-button" onClick={() => onEnter('teacher')}>교사로 들어가기</button><p className="privacy-note">이 앱은 이름, 연락처, 생년월일을 받지 않아요.</p></div><aside className="welcome-art"><div className="floating-card card-a">1/2 <span>+ 1/4</span></div><div className="floating-card card-b">24 <span>cm³</span></div><div className="shape circle" /><div className="shape block" /><div className="shape triangle" /><p>생각하고, 풀고,<br />다시 성장하는 시간</p></aside></main>;
}

function StudentView({ screen, setScreen, progress, units, openLearning, activeUnit, activeQuestion, choice, setChoice, result, hintLevel, setHintLevel, submitAnswer, nextQuestion, attemptsByUnit, correctCount }) {
  return <><nav className="student-nav"><button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>홈</button><button className={screen === 'review' ? 'active' : ''} onClick={() => setScreen('review')}>다시 풀기</button><button className={screen === 'badges' ? 'active' : ''} onClick={() => setScreen('badges')}>내 배지</button></nav>
    {screen === 'home' && <section className="page student-home"><div className="greeting"><div><p className="eyebrow">안녕, 별이!</p><h2>어느 단원을<br />복습해 볼까요?</h2></div><div className="weekly-card"><span>이번 주</span><strong>{progress.attempts.length}문제</strong><div className="mini-bars"><i /><i /><i className="empty" /><i className="empty" /><i className="empty" /></div></div></div><section className="continue-card"><div><Pill tone="violet">이어서 풀기</Pill><h3>분수의 나눗셈</h3><p>기본 개념을 탄탄히 다져 봐요.</p></div><button className="round-arrow" onClick={() => openLearning('분수의 나눗셈')}>→</button></section><div className="section-heading"><div><p className="eyebrow">단원 선택</p><h3>내가 고르는 복습</h3></div><span>2 / 4 단원 열림</span></div><div className="unit-grid">{units.map((unit) => <article className={`unit-card ${unit.color} ${unit.locked ? 'locked' : ''}`} key={unit.name}><div className="unit-icon">{unit.locked ? '🔒' : unit.icon}</div><p>{unit.locked ? '준비 중' : `${correctCount(unit.name)}문제 정답`}</p><h3>{unit.name}</h3><span>{unit.text}</span>{!unit.locked && <button onClick={() => openLearning(unit.name)}>시작하기 <b>→</b></button>}</article>)}</div></section>}
    {screen === 'learn' && activeQuestion && <LearningView unit={activeUnit} question={activeQuestion} choice={choice} setChoice={setChoice} result={result} hintLevel={hintLevel} setHintLevel={setHintLevel} submitAnswer={submitAnswer} nextQuestion={nextQuestion} setScreen={setScreen} difficulty={progress.difficulty[activeUnit] || 2} />}
    {screen === 'review' && <ReviewView attempts={progress.attempts} questions={starterQuestions} onPick={(question) => { setScreen('learn'); openLearning(question.unit); }} />}
    {screen === 'badges' && <BadgeView progress={progress} />}
  </>;
}

function LearningView({ unit, question, choice, setChoice, result, hintLevel, setHintLevel, submitAnswer, nextQuestion, setScreen, difficulty }) {
  const hint = hintLevel === 1 ? question.hint1 : hintLevel === 2 ? question.hint2 : null;
  return <section className="page learning-page"><button className="back-button" onClick={() => setScreen('home')}>← 단원으로 돌아가기</button><div className="learn-top"><div><Pill tone="violet">{unit}</Pill><p>{question.topic} · 난이도 {'●'.repeat(difficulty)}{'○'.repeat(5 - difficulty)}</p></div><div className="question-count">집중 학습 <b>01</b> / 04</div></div><article className="question-card"><div className="question-number">Q</div><h1>{question.prompt}</h1><div className="choice-grid">{question.options.map((option, index) => { const state = result ? (option === question.answer ? 'correct' : option === choice ? 'wrong' : '') : choice === option ? 'selected' : ''; return <button key={option} className={`choice ${state}`} onClick={() => !result && setChoice(option)} disabled={!!result}><span>{['가', '나', '다', '라'][index]}</span>{option}</button>; })}</div>{hint && <div className="hint-box"><span>💡</span><div><b>{hintLevel}단계 힌트</b><p>{hint}</p></div></div>}{!result ? <div className="question-actions"><button className="hint-button" onClick={() => setHintLevel((level) => Math.min(2, level + 1))} disabled={hintLevel === 2}>💡 {hintLevel === 2 ? '힌트를 모두 봤어요' : '힌트 보기'}</button><button className="primary" onClick={submitAnswer} disabled={!choice}>정답 확인 <span>→</span></button></div> : <div className={`answer-panel ${result.correct ? 'good' : 'try'}`}><div className="answer-icon">{result.correct ? '✓' : '!'}</div><div><h3>{result.correct ? '정답이에요! 정말 잘했어요.' : '아쉬워요. 해설을 함께 볼까요?'}</h3><p>{question.explanation}</p></div><button className="primary" onClick={nextQuestion}>다음 문제 <span>→</span></button></div>}</article></section>;
}

function ReviewView({ attempts, questions, onPick }) {
  const wrongIds = [...new Set(attempts.filter((attempt) => !attempt.correct).map((attempt) => attempt.questionId))];
  const wrong = questions.filter((question) => wrongIds.includes(question.id));
  return <section className="page simple-page"><p className="eyebrow">다시 풀기</p><h2>조금 더 생각해 볼 문제</h2><p className="subcopy">틀렸던 문제를 다시 풀면 개념이 더 단단해져요.</p>{wrong.length ? <div className="review-list">{wrong.map((question) => <article key={question.id}><Pill tone="coral">{question.unit}</Pill><h3>{question.prompt}</h3><button className="secondary" onClick={() => onPick(question)}>다시 풀기 →</button></article>)}</div> : <div className="empty-state"><span>✦</span><h3>아직 다시 풀 문제가 없어요.</h3><p>문제를 풀면 이곳에 복습할 문제가 생겨요.</p></div>}</section>;
}

function BadgeView({ progress }) { const all = [{ name: '첫 걸음', icon: '🌱', text: '첫 문제를 풀었어요.', earned: true }, { name: '분수 탐험가', icon: '🧭', text: '분수 단원 3문제를 풀었어요.', earned: true }, { name: '꾸준한 별', icon: '🌟', text: '3일 연속 학습했어요.', earned: progress.streak >= 3 }, { name: '부피 박사', icon: '📦', text: '부피 단원 5문제를 맞혀요.', earned: false }]; return <section className="page simple-page"><p className="eyebrow">내 배지</p><h2>차곡차곡 모은<br />나의 성장 기록</h2><div className="badge-grid">{all.map((badge) => <article className={badge.earned ? '' : 'dim'} key={badge.name}><span>{badge.icon}</span><h3>{badge.name}</h3><p>{badge.text}</p>{badge.earned && <Pill tone="mint">획득 완료</Pill>}</article>)}</div></section>; }

function TeacherView({ screen, setScreen, questions, setQuestions, showForm, setShowForm, showToast }) {
  const [tab, setTab] = useState('overview');
  const students = [{ id: 's6-083', label: '별이', progress: 78, accuracy: 86, wrong: 2, last: '오늘', weak: '분수 ÷ 분수' }, { id: 's6-041', label: '나무', progress: 62, accuracy: 71, wrong: 5, last: '어제', weak: '직육면체의 부피' }, { id: 's6-097', label: '구름', progress: 45, accuracy: 60, wrong: 7, last: '5일 전', weak: '분수 ÷ 자연수' }, { id: 's6-056', label: '달빛', progress: 84, accuracy: 92, wrong: 1, last: '오늘', weak: '분수 ÷ 분수' }];
  return <><aside className="teacher-sidebar"><button className="teacher-brand" onClick={() => setScreen('dashboard')}><span>∑</span> 수학 한 걸음 <small>교사용</small></button><nav><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>▦ 대시보드</button><button className={tab === 'students' ? 'active' : ''} onClick={() => setTab('students')}>♙ 학생 기록</button><button className={tab === 'questions' ? 'active' : ''} onClick={() => setTab('questions')}>▤ 문제 관리</button><button className={tab === 'classes' ? 'active' : ''} onClick={() => setTab('classes')}>⌂ 반 관리</button></nav><div className="sidebar-help">도움이 필요하신가요?<button>운영 안내 보기 →</button></div></aside><section className="teacher-main"><header className="teacher-header"><div><p className="eyebrow">6학년 1반</p><h1>{tab === 'overview' ? '학습 현황' : tab === 'students' ? '학생 기록' : tab === 'questions' ? '문제 관리' : '반 관리'}</h1></div><div><button className="outline-button" onClick={() => showToast('집계 CSV를 준비했어요.')}>↓ CSV 내려받기</button><button className="avatar" aria-label="교사 계정">김</button></div></header>{tab === 'overview' && <Dashboard students={students} />}{tab === 'students' && <StudentRecords students={students} />}{tab === 'questions' && <QuestionManager questions={questions} setQuestions={setQuestions} setShowForm={setShowForm} />}{tab === 'classes' && <ClassManager showToast={showToast} />}</section>{showForm && <QuestionForm onClose={() => setShowForm(false)} onSave={(question) => { setQuestions((current) => [...current, question]); setShowForm(false); showToast('문제를 검토 중 상태로 저장했어요.'); }} />}</>;
}

function Dashboard({ students }) { return <div className="teacher-content"><div className="metric-row"><Metric label="이번 주 학습 학생" value="18" suffix="명" trend="지난주보다 3명 늘었어요" /><Metric label="평균 정답률" value="76" suffix="%" trend="지난주보다 4% 올랐어요" good /><Metric label="다시 풀 문제" value="42" suffix="개" trend="복습이 필요한 문제예요" /></div><div className="teacher-grid"><section className="panel wide-panel"><div className="panel-head"><div><p className="eyebrow">단원별 학습 현황</p><h2>이번 주 학습 추이</h2></div><button className="text-link">자세히 보기 →</button></div><div className="chart-wrap"><div className="chart-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="bar-chart">{[42, 58, 70, 64, 82, 78, 91].map((height, index) => <div className="bar-column" key={index}><i style={{ height: `${height}%` }} /><span>{['월', '화', '수', '목', '금', '토', '일'][index]}</span></div>)}</div></div></section><section className="panel"><div className="panel-head"><div><p className="eyebrow">도움이 필요한 단원</p><h2>학급 약점</h2></div></div><div className="weak-list"><div><span className="dot violet-dot" /><p>분수 ÷ 분수 <b>62%</b></p><i><em style={{ width: '62%' }} /></i></div><div><span className="dot coral-dot" /><p>들이와 부피 <b>68%</b></p><i><em style={{ width: '68%' }} /></i></div><div><span className="dot mint-dot" /><p>부피의 활용 <b>74%</b></p><i><em style={{ width: '74%' }} /></i></div></div></section><section className="panel full"><div className="panel-head"><div><p className="eyebrow">최근 학습 기록</p><h2>학생별 현황</h2></div><button className="text-link">전체 보기 →</button></div><StudentTable students={students.slice(0, 4)} /></section></div></div>; }
function Metric({ label, value, suffix, trend, good }) { return <section className="metric"><p>{label}</p><strong>{value}<small>{suffix}</small></strong><span className={good ? 'positive' : ''}>{good ? '↗' : '•'} {trend}</span></section>; }
function StudentTable({ students }) { return <div className="student-table"><div className="table-head"><span>학습 ID</span><span>진도</span><span>정답률</span><span>오답</span><span>최근 학습</span><span /></div>{students.map((student) => <div className="table-row" key={student.id}><span><b className="student-avatar">{student.label[0]}</b>{student.id}</span><span><i className="progress"><em style={{ width: `${student.progress}%` }} /></i>{student.progress}%</span><span>{student.accuracy}%</span><span className={student.wrong > 4 ? 'warning' : ''}>{student.wrong}개</span><span>{student.last}</span><button className="more-button" aria-label={`${student.id} 상세 보기`}>⋯</button></div>)}</div>; }
function StudentRecords({ students }) { return <div className="teacher-content"><div className="filter-row"><input placeholder="학습 ID 검색" aria-label="학습 ID 검색" /><select aria-label="학습 상태"><option>전체 학습 상태</option><option>7일 이상 미학습</option><option>복습 필요</option></select><select aria-label="단원"><option>전체 단원</option><option>분수의 나눗셈</option><option>직육면체의 부피</option></select></div><section className="panel full records"><div className="panel-head"><div><p className="eyebrow">가명 학습 기록</p><h2>학생 {students.length}명</h2></div><Pill tone="gray">이름을 저장하지 않아요</Pill></div><StudentTable students={students} /></section></div>; }
function QuestionManager({ questions, setQuestions, setShowForm }) { const [filter, setFilter] = useState('전체'); return <div className="teacher-content"><div className="question-toolbar"><div className="filter-tabs">{['전체', '분수의 나눗셈', '직육면체의 부피'].map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><button className="primary" onClick={() => setShowForm(true)}>+ 문제 등록</button></div><section className="panel full question-list"><div className="question-list-head"><span>문제</span><span>단원</span><span>난이도</span><span>상태</span><span /></div>{questions.filter((question) => filter === '전체' || question.unit === filter).map((question) => <div className="question-row" key={question.id}><div><b>{question.prompt}</b><small>{question.topic}</small></div><span>{question.unit}</span><span>{'●'.repeat(question.difficulty)}{'○'.repeat(5 - question.difficulty)}</span><Pill tone={question.status === '검토 중' ? 'sun' : 'mint'}>{question.status || '공개'}</Pill><button className="more-button" aria-label="문제 메뉴">⋯</button></div>)}</section></div>; }
function ClassManager({ showToast }) { return <div className="teacher-content"><section className="panel class-panel"><p className="eyebrow">6학년 1반</p><h2>학생 계정 관리</h2><p>학습 ID만으로 학생 기록을 관리합니다. 이름 대응표는 이 앱에 저장하지 않습니다.</p><div><button className="primary" onClick={() => showToast('학습 ID 20개를 발급했어요.')}>학습 ID 일괄 발급</button><button className="outline-button" onClick={() => showToast('초기 비밀번호 안내를 준비했어요.')}>초기 비밀번호 안내</button></div></section></div>; }
function QuestionForm({ onClose, onSave }) { const [form, setForm] = useState({ prompt: '', unit: '분수의 나눗셈', topic: '분수 ÷ 자연수', difficulty: 2, answer: '', explanation: '', hint1: '', hint2: '' }); const update = (key, value) => setForm((current) => ({ ...current, [key]: value })); const ready = form.prompt && form.answer && form.explanation && form.hint1 && form.hint2; return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="새 문제 등록"><form className="question-form" onSubmit={(event) => { event.preventDefault(); if (ready) onSave({ ...form, id: `teacher-${Date.now()}`, options: [form.answer, '보기 2', '보기 3', '보기 4'], status: '검토 중' }); }}><div className="form-head"><div><p className="eyebrow">문제 은행</p><h2>새 문제 등록</h2></div><IconButton label="닫기" onClick={onClose}>×</IconButton></div><div className="form-grid"><label>단원<select value={form.unit} onChange={(event) => update('unit', event.target.value)}><option>분수의 나눗셈</option><option>직육면체의 부피</option></select></label><label>난이도<select value={form.difficulty} onChange={(event) => update('difficulty', Number(event.target.value))}>{[1,2,3,4,5].map((value) => <option key={value} value={value}>{value}단계</option>)}</select></label></div><label>문제<textarea value={form.prompt} onChange={(event) => update('prompt', event.target.value)} placeholder="학생에게 보여 줄 문제를 입력하세요." /></label><label>정답<input value={form.answer} onChange={(event) => update('answer', event.target.value)} placeholder="예: 5/6" /></label><label>1단계 힌트<input value={form.hint1} onChange={(event) => update('hint1', event.target.value)} placeholder="접근 방법을 안내해 주세요." /></label><label>2단계 힌트<input value={form.hint2} onChange={(event) => update('hint2', event.target.value)} placeholder="계산이나 조건을 안내해 주세요." /></label><label>해설<textarea value={form.explanation} onChange={(event) => update('explanation', event.target.value)} placeholder="정답의 이유를 설명해 주세요." /></label><p className="form-note">저작권이 확인된 자료만 등록하세요. 학생 이름·사진·연락처를 문제에 넣지 마세요.</p><div className="form-actions"><button type="button" className="secondary" onClick={onClose}>취소</button><button className="primary" disabled={!ready}>검토 중으로 저장</button></div></form></div>; }
