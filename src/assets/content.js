// 이 파일만 수정하면 문구, 사진, 퀴즈, 선물을 바꿀 수 있어요.
// 처음에는 예시 콘텐츠입니다. 실제 정보로 바꾸고 demo를 false로 바꾸세요.
export const content = {
  demo: true,
  author: '가연',
  recipient: '', // 비워두면 입력한 이름을 사용해요.
  birthday: '', // 선택: '1998-10-20'. 비워두면 유효한 생년월일은 모두 통과.
  traits: [
    { icon: '☀', title: '웃으면 반칙', text: '별거 아닌 순간도 자꾸 웃게 만드는 사람.' },
    { icon: '🍀', title: '은근히 다정함', text: '작은 것 하나 챙겨주는 마음이 참 좋은 사람.' },
    { icon: '🧸', title: '아무튼 내 편', text: '같이 있으면 평범한 하루도 특별해지는 사람.' },
  ],
  memories: [
    { src: '', icon: '🌷', caption: '처음이라 더 기억나는 날' },
    { src: '', icon: '🎡', caption: '별거 안 해도 웃겼던 날' },
    { src: '', icon: '🌅', caption: '다음 장면도 같이 만들자' },
  ], // 사진은 public/photos에 넣고 src: '/photos/파일명.jpg'
  questions: [
    { question: '가연이가 가장 좋아하는 음식은?', options: ['떡볶이', '초밥', '피자', '파스타'], answer: 0, hint: '매콤하고 쫄깃한 그 음식!' },
    { question: '가연이가 고른 최고의 데이트는?', options: ['맛집 가고 산책하기', '새벽 마라톤', '하루 종일 등산', '각자 집에서 쉬기'], answer: 0, hint: '맛있는 걸 먹은 다음, 나란히 걷는 시간.' },
  ], // answer는 첫 번째 보기 0, 두 번째 1, 세 번째 2, 네 번째 3
  gift: { title: '너를 위해 준비했어!', image: '', message: '생일 진심으로 축하해 ♡\n가연이에게 “선물 주세요!”라고 말해주세요.' },
};
