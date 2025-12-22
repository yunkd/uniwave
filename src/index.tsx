import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'
import type { HonoEnv } from './types/env'

// 라우트 임포트
import authRoutes from './routes/auth'
// TODO: 추후 추가
// import studentRoutes from './routes/student'
// import institutionRoutes from './routes/institution'
// import universityRoutes from './routes/university'

const app = new Hono<HonoEnv>()

// ========================================
// 미들웨어
// ========================================

// 로거
app.use('*', logger())

// CORS 설정
app.use('/api/*', cors({
  origin: (origin) => origin, // 개발 중에는 모든 origin 허용
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// 정적 파일 서빙 (public/static/ → /static/*)
app.use('/static/*', serveStatic({ root: './public' }))

// ========================================
// API 라우트
// ========================================

// 헬스 체크
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Uniwave Pro API'
  })
})

// 버전 정보
app.get('/api/version', (c) => {
  return c.json({
    version: '1.0.0',
    name: 'Uniwave Pro',
    description: '대학 실습 관리 플랫폼'
  })
})

// 라우트 연결
app.route('/api/auth', authRoutes)

// TODO: 추후 추가
// app.route('/api/student', studentRoutes)
// app.route('/api/institution', institutionRoutes)
// app.route('/api/university', universityRoutes)

// ========================================
// 프론트엔드 페이지 (Vue 앱이 빌드되기 전까지는 랜딩 페이지)
// ========================================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Uniwave Pro - 대학 실습 관리 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div class="container mx-auto px-4 py-16">
            <!-- 헤더 -->
            <div class="text-center mb-16">
                <h1 class="text-5xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-graduation-cap text-blue-600"></i>
                    Uniwave Pro
                </h1>
                <p class="text-xl text-gray-600">
                    대학 실습 관리 플랫폼 - 스마트한 실습 프로세스
                </p>
            </div>

            <!-- 기능 소개 -->
            <div class="grid md:grid-cols-3 gap-8 mb-16">
                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
                    <div class="text-blue-600 text-4xl mb-4">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">학생</h3>
                    <ul class="text-gray-600 space-y-2">
                        <li>✅ 출석 체크</li>
                        <li>✅ 실습 일지 작성</li>
                        <li>✅ 원클릭 제본 신청</li>
                    </ul>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
                    <div class="text-green-600 text-4xl mb-4">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">기관</h3>
                    <ul class="text-gray-600 space-y-2">
                        <li>✅ 출석/일지 승인</li>
                        <li>✅ 평가서 작성</li>
                        <li>✅ 실습생 관리</li>
                    </ul>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
                    <div class="text-purple-600 text-4xl mb-4">
                        <i class="fas fa-university"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">대학</h3>
                    <ul class="text-gray-600 space-y-2">
                        <li>✅ 학생 승인</li>
                        <li>✅ 양식 관리</li>
                        <li>✅ 제본 관리</li>
                    </ul>
                </div>
            </div>

            <!-- 상태 카드 -->
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-2xl font-semibold mb-6 text-center">
                    <i class="fas fa-code text-blue-600"></i>
                    개발 상태
                </h2>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700">백엔드 (Hono + Cloudflare Workers)</span>
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ✅ 실행 중
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700">Supabase 데이터베이스</span>
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            ⏳ 연결 대기
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700">Vue 3 프론트엔드</span>
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            ⏳ 개발 중
                        </span>
                    </div>
                </div>

                <!-- API 테스트 -->
                <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 class="font-semibold mb-2">API 테스트</h3>
                    <div class="space-y-2 text-sm">
                        <div>
                            <a href="/api/health" class="text-blue-600 hover:underline" target="_blank">
                                <i class="fas fa-link"></i> GET /api/health
                            </a>
                        </div>
                        <div>
                            <a href="/api/version" class="text-blue-600 hover:underline" target="_blank">
                                <i class="fas fa-link"></i> GET /api/version
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 푸터 -->
            <div class="text-center mt-16 text-gray-600">
                <p class="mb-2">
                    <i class="fas fa-rocket"></i>
                    빠른 출시를 위한 MVP 개발 중
                </p>
                <p class="text-sm">
                    Made with ❤️ by 윤경대
                </p>
            </div>
        </div>

        <script>
            // API 상태 체크
            async function checkAPI() {
                try {
                    const response = await fetch('/api/health')
                    const data = await response.json()
                    console.log('API Health:', data)
                } catch (error) {
                    console.error('API Error:', error)
                }
            }
            
            checkAPI()
        </script>
    </body>
    </html>
  `)
})

// ========================================
// 404 핸들러
// ========================================

app.notFound((c) => {
  return c.json({ 
    error: 'Not Found',
    path: c.req.path
  }, 404)
})

// ========================================
// 에러 핸들러
// ========================================

app.onError((err, c) => {
  console.error('[Error]', err)
  
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500)
})

export default app
