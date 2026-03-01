import { useMemo, useState } from 'react'
import './App.css'

type Topic = 'stability' | 'initiative' | 'risk' | 'execution' | 'people'

type Question = {
  id: number
  text: string
  answer: boolean
  topic: Topic
}

const QUESTION_POOL: Question[] = [
  {
    id: 1,
    text: '월급이 조금 적어도 매달 고정 수입이 있는 게 마음이 편하다.',
    answer: false,
    topic: 'stability',
  },
  {
    id: 2,
    text: '누가 시키지 않아도 스스로 새로운 일을 벌리는 편이다.',
    answer: true,
    topic: 'initiative',
  },
  {
    id: 3,
    text: '실패 가능성이 있어도 재밌어 보이면 일단 해보는 편이다.',
    answer: true,
    topic: 'risk',
  },
  {
    id: 4,
    text: '명확한 매뉴얼이 없으면 일을 시작하기 어렵다.',
    answer: false,
    topic: 'execution',
  },
  {
    id: 5,
    text: '낯선 사람과 대화해 기회를 만드는 일이 생각보다 즐겁다.',
    answer: true,
    topic: 'people',
  },
  {
    id: 6,
    text: '안정적인 복지와 제도가 커리어 선택에서 가장 중요하다.',
    answer: false,
    topic: 'stability',
  },
  {
    id: 7,
    text: '아이디어가 떠오르면 주말에도 직접 작은 테스트를 해본다.',
    answer: true,
    topic: 'initiative',
  },
  {
    id: 8,
    text: '큰 보상 가능성이 있으면 불확실한 선택도 감수할 수 있다.',
    answer: true,
    topic: 'risk',
  },
  {
    id: 9,
    text: '문제가 생기면 지시를 기다리기보다 내가 먼저 해결안을 만든다.',
    answer: true,
    topic: 'execution',
  },
  {
    id: 10,
    text: '처음 보는 사람에게 내 아이디어를 소개하는 게 부담스럽다.',
    answer: false,
    topic: 'people',
  },
  {
    id: 11,
    text: '예측 가능한 생활 리듬이 깨지는 상황은 최대한 피하고 싶다.',
    answer: false,
    topic: 'stability',
  },
  {
    id: 12,
    text: '새 프로젝트를 맡을 때 "이걸로 수익을 만들 수 있을까?"를 먼저 생각한다.',
    answer: true,
    topic: 'initiative',
  },
  {
    id: 13,
    text: '주변에서 말려도 내가 확신하면 끝까지 밀어붙이는 편이다.',
    answer: true,
    topic: 'risk',
  },
  {
    id: 14,
    text: '자원이 부족해도 우선 가능한 방법부터 실행해보는 스타일이다.',
    answer: true,
    topic: 'execution',
  },
  {
    id: 15,
    text: '사람을 설득하고 협업을 이끌어내는 과정이 꽤 재미있다.',
    answer: true,
    topic: 'people',
  },
  {
    id: 16,
    text: '내가 책임져야 하는 범위가 너무 넓으면 스트레스가 크게 올라간다.',
    answer: false,
    topic: 'stability',
  },
  {
    id: 17,
    text: '같은 일을 오래 반복하면 빨리 지루해지고 변화를 찾게 된다.',
    answer: true,
    topic: 'initiative',
  },
  {
    id: 18,
    text: '성과가 불확실하면 시작 자체를 미루는 편이다.',
    answer: false,
    topic: 'risk',
  },
]

const QUIZ_SIZE = 10

const TOPIC_LABEL: Record<Topic, string> = {
  stability: '안정 선호',
  initiative: '주도성',
  risk: '모험 성향',
  execution: '실행 방식',
  people: '관계/설득',
}

const ENTREPRENEUR_STRENGTH: Record<Topic, string> = {
  stability: '안정도 챙기면서 기회를 보는 균형 감각이 좋습니다.',
  initiative: '스스로 판을 만드는 성향이 강합니다.',
  risk: '불확실성을 견디며 앞으로 나가는 힘이 있습니다.',
  execution: '자원 제한이 있어도 일단 실행해보는 타입입니다.',
  people: '사람을 통해 기회를 연결하는 능력이 좋습니다.',
}

const EMPLOYEE_STRENGTH: Record<Topic, string> = {
  stability: '안정적인 환경에서 꾸준히 성과를 내는 강점이 있습니다.',
  initiative: '맡은 일을 체계적으로 완성하는 집중력이 좋습니다.',
  risk: '신중하게 판단해 손실을 줄이는 감각이 좋습니다.',
  execution: '기준과 절차를 지키며 품질을 안정적으로 맞춥니다.',
  people: '신뢰 기반 협업으로 조직 시너지를 내는 타입입니다.',
}

const pickRandomQuestions = (pool: Question[], size: number) => {
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
  }
  return shuffled.slice(0, size)
}

function App() {
  const quizQuestions = useMemo(
    () => pickRandomQuestions(QUESTION_POOL, QUIZ_SIZE),
    [],
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const isFinished = currentIndex >= quizQuestions.length

  const entrepreneurScore = useMemo(() => {
    return answers.reduce((total, userAnswer, index) => {
      return userAnswer === quizQuestions[index].answer ? total + 1 : total
    }, 0)
  }, [answers, quizQuestions])

  const employeeScore = quizQuestions.length - entrepreneurScore

  const resultMessage = useMemo(() => {
    if (entrepreneurScore >= 8) return '결과: 사업가형 DNA 강함'
    if (entrepreneurScore >= 5) return '결과: 균형형 (직장인 + 사업가 기질)'
    return '결과: 직장인형 DNA 강함'
  }, [entrepreneurScore])

  const analysisMessage = useMemo(() => {
    const topicDelta = answers.reduce<Record<Topic, number>>(
      (acc, userAnswer, index) => {
        const topic = quizQuestions[index].topic
        if (userAnswer === quizQuestions[index].answer) {
          acc[topic] += 1
        } else {
          acc[topic] -= 1
        }
        return acc
      },
      {
        stability: 0,
        initiative: 0,
        risk: 0,
        execution: 0,
        people: 0,
      },
    )

    const strongestEntreTopic = Object.entries(topicDelta)
      .sort((a, b) => b[1] - a[1])[0][0] as Topic
    const strongestEmployeeTopic = Object.entries(topicDelta)
      .sort((a, b) => a[1] - b[1])[0][0] as Topic

    if (entrepreneurScore >= 8) {
      return `분석: ${TOPIC_LABEL[strongestEntreTopic]}에서 특히 사업가 성향이 강합니다. ${ENTREPRENEUR_STRENGTH[strongestEntreTopic]}`
    }

    if (entrepreneurScore >= 5) {
      return `분석: 상황에 따라 직장인형/사업가형을 유연하게 오가는 타입입니다. 강점은 ${TOPIC_LABEL[strongestEntreTopic]}, 보완 포인트는 ${TOPIC_LABEL[strongestEmployeeTopic]}입니다.`
    }

    return `분석: ${TOPIC_LABEL[strongestEmployeeTopic]}에서 직장인형 강점이 두드러집니다. ${EMPLOYEE_STRENGTH[strongestEmployeeTopic]}`
  }, [answers, entrepreneurScore, quizQuestions])

  const handleAnswer = (value: boolean) => {
    if (isFinished) return

    setAnswers((prev) => [...prev, value])
    setCurrentIndex((prev) => prev + 1)
  }

  const resetQuiz = () => {
    setCurrentIndex(0)
    setAnswers([])
  }

  return (
    <main className="app">
      <section className="quiz-card">
        <p className="eyebrow">TOSS 제출용 데모</p>
        <h1>나는 직장인형? 사업가형? O/X 테스트</h1>

        {!isFinished ? (
          <>
            <p className="progress">
              {currentIndex + 1} / {quizQuestions.length}
            </p>
            <p className="question">{quizQuestions[currentIndex].text}</p>
            <div className="actions">
              <button className="btn btn-o" onClick={() => handleAnswer(true)}>
                O
              </button>
              <button className="btn btn-x" onClick={() => handleAnswer(false)}>
                X
              </button>
            </div>
          </>
        ) : (
          <div className="result">
            <p className="score">
              사업가형 점수: <strong>{entrepreneurScore}</strong> / {quizQuestions.length}
            </p>
            <p className="score">
              직장인형 점수: <strong>{employeeScore}</strong> / {quizQuestions.length}
            </p>
            <p>{resultMessage}</p>
            <p className="analysis">{analysisMessage}</p>
            <button className="btn btn-restart" onClick={resetQuiz}>
              다시 하기
            </button>
          </div>
        )}
      </section>
      <div className="disclaimer">
        이 테스트는 재미를 위한 성향 콘텐츠입니다.
      </div>
    </main>
  )
}

export default App
