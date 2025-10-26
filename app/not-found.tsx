export const metadata = {
  title: '404 - Page Not Found',
}

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div searching={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '120px', fontWeight: 'bold', color: '#3c0a6b', marginBottom: '20px' }}>404</h1>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          The page you are looking for does not exist.
        </p>
        <a href="/" style={{ backgroundColor: '#3c0a6b', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
          Go Home
        </a>
      </div>
    </div>
  )
}
