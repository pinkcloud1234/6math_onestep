import './globals.css';

export const metadata = {
  title: '수학 한 걸음',
  description: '초등학교 6학년 수학 복습 앱',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
