import { Link, Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Intro } from './components/Intro'
import { Toaster } from './lib/toast'
import { useT } from './i18n'
import { DiaryPage } from './routes/Diary'
import { EventsPage } from './routes/Events'
import { GalleryPage } from './routes/Gallery'
import { HomePage } from './routes/Home'
import { HousePage } from './routes/House'
import { JoinPage } from './routes/Join'
import { KidPage } from './routes/Kid'
import { MoneyPage } from './routes/Money'
import { NewFamilyPage } from './routes/NewFamily'
import { NewKidPage } from './routes/NewKid'
import { ProfilePage } from './routes/Profile'
import { SessionLayout } from './routes/SessionLayout'
import { ShopPage } from './routes/Shop'
import { TrophiesPage } from './routes/Trophies'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <Intro />
    </>
  ),
  notFoundComponent: NotFound,
})

function NotFound() {
  const { t } = useT()
  return (
    <div className="grid min-h-dvh place-items-center p-6 text-center">
      <div className="card max-w-sm p-6">
        <p className="text-5xl">🥚</p>
        <h1 className="mt-2 text-2xl font-bold">{t('nf.title')}</h1>
        <p className="mt-1 opacity-70">{t('nf.text')}</p>
        <Link to="/" className="btn-primary mt-4">{t('nf.btn')}</Link>
      </div>
    </div>
  )
}

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const newFamilyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/nuova', component: NewFamilyPage })
const galleryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/album', component: GalleryPage })
const joinRoute = createRoute({ getParentRoute: () => rootRoute, path: '/s/$sessionId/unisciti', component: JoinPage })

export const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/s/$sessionId',
  component: SessionLayout,
  validateSearch: (s: Record<string, unknown>): { benvenuto?: boolean } => (s.benvenuto ? { benvenuto: true } : {}),
})

const houseRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/', component: HousePage })
const kidRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/cucciolo/$kidId', component: KidPage })
const newKidRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/nuovo-cucciolo', component: NewKidPage })
const eventsRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/imprevisti', component: EventsPage })
const shopRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/negozio', component: ShopPage })
const moneyRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/soldini', component: MoneyPage })
const diaryRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/diario', component: DiaryPage })
const trophiesRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/trofei', component: TrophiesPage })
const profileRoute = createRoute({ getParentRoute: () => sessionRoute, path: '/io', component: ProfilePage })

const routeTree = rootRoute.addChildren([
  homeRoute,
  newFamilyRoute,
  galleryRoute,
  joinRoute,
  sessionRoute.addChildren([houseRoute, kidRoute, newKidRoute, eventsRoute, shopRoute, moneyRoute, diaryRoute, trophiesRoute, profileRoute]),
])

export const router = createRouter({ routeTree, defaultPreload: 'intent', scrollRestoration: true })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
