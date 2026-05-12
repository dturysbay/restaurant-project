# WORKFLOW.md — FoodHub

## Team

| Role | Name |
|---|---|
| 🎨 Frontend | Dimash Turysbay |
| ⚙️ Backend | Olzhas |
| 🧠 AI Engineer | Akynbek |
| 🧪 QA & Workflow | Yedige Ashmet |

---

## Definition of Done Checklist

- [x] GitHub репозиторий
- [x] README с описанием, стеком и инструкцией запуска
- [x] `ai-rules/*.md` от каждого участника
- [x] MCP / sub-agents описаны и используются
- [x] Есть AI-сгенерированные коммиты (помечены `[AI]` в message)
- [x] Есть автотесты (JUnit 5 + Angular Jasmine)
- [ ] Деплой (Vercel / Netlify / Railway) — инструкции ниже

---

## Деплой

### Frontend → Vercel

```bash
# 1. Установи Vercel CLI
npm i -g vercel

# 2. Перейди в папку фронтенда
cd restaurants-front

# 3. Задеплой
vercel --prod
```

**Настройки в Vercel Dashboard:**

| Setting | Value |
|---|---|
| Framework | Angular |
| Build Command | `npm run build` |
| Output Directory | `dist/restaurants-front/browser` |
| Environment Variable | `BACKEND_URL=https://foodhub-api.up.railway.app` |

После деплоя замени `http://localhost:8080/api` в `restaurant.service.ts` на production URL.

---

### Backend + PostgreSQL → Railway

```bash
# 1. Установи Railway CLI
npm i -g @railway/cli

# 2. Войди
railway login

# 3. Перейди в папку бэкенда
cd project-restaurant

# 4. Инициализируй проект
railway init

# 5. Добавь PostgreSQL service в Railway Dashboard:
#    New Service → Database → PostgreSQL

# 6. Задеплой
railway up
```

**Environment Variables на Railway:**

| Variable | Value |
|---|---|
| `DB_URL` | `${{Postgres.DATABASE_URL}}` (auto-linked) |
| `DB_USERNAME` | `${{Postgres.PGUSER}}` |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (твой ключ) |
| `PORT` | `8080` |

Railway автоматически запустит Flyway миграции при старте — данные ресторанов заполнятся сами.

---

### Альтернатива: Render (бесплатный tier)

**Backend (Web Service):**
- Repository: `github.com/your/restaurant-project`
- Root Directory: `project-restaurant`
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/project-restaurant-*.jar`
- Environment: добавь переменные как выше

**Database:**
- New → PostgreSQL (Free tier: 1GB)
- Скопируй `Internal Database URL` → вставь в `DB_URL`

---

## AI Usage Evidence

### Коммиты с AI-генерацией

```
[AI] feat: generate Restaurant entity and Flyway V1 migration
[AI] feat: scaffold Angular RestaurantService with HttpClient
[AI] feat: implement CartService with Angular Signals
[AI] feat: add AI chatbot with Anthropic Claude API integration
[AI] test: generate JUnit 5 tests for RestaurantService and Controller
[AI] test: generate Jasmine specs for CartService and ChatService
```

### MCP использование

| Участник | MCP / Tool | Для чего |
|---|---|---|
| Dimash | Context7 MCP | Документация Angular 17 Signals API |
| Dimash | Playwright MCP | E2E тест фильтрации ресторанов |
| Olzhas | Context7 MCP | Spring Boot 3 WebClient docs |
| Olzhas | PostgreSQL MCP | Написание JPQL-запросов и миграций |
| Akynbek | Anthropic Claude API | LLM для чат-бота рекомендаций |
| Akynbek | RestaurantRepository Tool | Динамический system prompt с реальными данными |
| Yedige | Playwright MCP | E2E тесты корзины и chatbot |
| Yedige | Code-analysis Sub-agent | Проверка покрытия тестами |

---

## Запуск тестов

### Backend (JUnit 5)

```bash
cd project-restaurant
./mvnw test
```

Отчёт: `target/surefire-reports/`

### Frontend (Jasmine + Karma)

```bash
cd restaurants-front
npm test
# или без браузера (CI):
npm test -- --watch=false --browsers=ChromeHeadless
```

### E2E (Playwright)

```bash
cd restaurants-front
npx playwright test
```

---

## Team Reflection

### 1. Где AI сэкономил больше всего времени?

**Dimash:** Генерация Angular компонентов — restaurant-card, cart-sidebar, chatbot — заняла бы 2–3 дня вручную. С Claude Code это ~2 часа. Особенно помогло с Tailwind CSS классами и Angular Signals — не пришлось читать документацию.

**Olzhas:** Flyway-миграции и seed-данные (9000+ menu items) — это очень долго вручную. AI сгенерировал SQL структуру и JPQL-запрос `findByCuisineTag` за минуту.

**Akynbek:** Архитектура `AiChatService` с динамическим system prompt, включающим реальные данные ресторанов из БД — это нетривиально. Claude показал паттерн с `WebClient` и `buildSystemPrompt()`.

**Yedige:** Написание тестов — обычно самая скучная часть. AI сгенерировал все JUnit и Jasmine specs за один prompt, включая edge cases (пустой список, 404, декремент до нуля в корзине).

### 2. Где AI ошибался?

- **Olzhas:** Claude предложил `RestTemplate` вместо `WebClient` для Anthropic API — устаревший подход в Spring Boot 3. Пришлось скорректировать промпт с указанием "Spring Boot 3, reactive".
- **Dimash:** Поначалу генерировал компоненты без `standalone: true` — Angular 17 требует это для нового стиля. Нужно было явно указать версию в промпте.
- **Akynbek:** Первый вариант system prompt не включал данные о времени доставки — AI придумывал цифры. Решение: добавить `deliveryTimeMin` в `buildSystemPrompt()`.

### 3. Что без AI заняло бы ×3 времени?

- Seed-данные: 100+ ресторанов, 9000+ menu items → парсер на Python занял 30 мин вместо 2+ дней ручного ввода
- CSS/дизайн: responsive layout с Tailwind, анимации cart-sidebar, typing indicator в chatbot
- Тесты: полный test suite (JUnit + Jasmine) → 20 мин промптов вместо дня написания вручную
- Документация: README, WORKFLOW.md, ai-rules — сгенерированы и отредактированы за час
