import { readFileSync, writeFileSync } from "fs";

function apply(role, patch) {
  if (!role) return;
  if (patch.missionPerksExtra?.length) {
    role.mission ??= { body: "" };
    role.mission.perks = [...(role.mission.perks ?? []), ...patch.missionPerksExtra];
  }
  if (patch.trustReplace?.length) {
    role.trust = { ...(role.trust ?? {}), points: patch.trustReplace };
  } else if (patch.trustExtra?.length) {
    role.trust ??= { points: [] };
    role.trust.points = [...(role.trust.points ?? []), ...patch.trustExtra];
  }
  if (patch.benefitsExtra?.length) {
    role.benefits.items = [...(role.benefits.items ?? []), ...patch.benefitsExtra];
  }
  if (patch.whyJoinExtra?.length) {
    role.whyJoin.items = [...(role.whyJoin.items ?? []), ...patch.whyJoinExtra];
  }
  if (patch.howItWorksExtra?.length) {
    role.howItWorks.items = [...(role.howItWorks.items ?? []), ...patch.howItWorksExtra];
  }
}

const EN = {
  pickers: {
    missionPerksExtra: [
      {
        title: "Fresh groceries & meals",
        description: "Pick produce, daily essentials, and ready-to-eat items for every Yango Deli order.",
        sticker: "/icons/icon1.svg",
      },
    ],
    trustExtra: [
      {
        title: "Fresh groceries & meals",
        description: "Pick produce, daily essentials, and ready-to-eat dishes — quality customers can taste.",
      },
      {
        title: "Break rooms in every branch",
        description: "Restrooms, seating, and kitchenettes so breaks feel human, not rushed.",
      },
    ],
    benefitsExtra: [
      {
        title: "Quality checks",
        description: "Verify expiry dates and product condition before every order leaves the branch.",
        icon: "/icons/icon2.svg",
      },
      {
        title: "Team rhythm",
        description: "Work with pickers, shift leads, and couriers in one smooth order flow.",
        icon: "/icons/young-team.svg",
      },
      {
        title: "Stable scheduling",
        description: "Morning, evening, and weekend slots you can plan around after onboarding.",
        icon: "/icons/Flexible-shifts.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Refer a friend",
        description: "Bring great people to Yango Deli and earn a referral bonus when they join.",
        image: "/images/Group-2087327955-1.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "30% employee discount",
        description: "Enjoy 30% off self-pickup products for breaks or end-of-day shopping.",
        icon: "/icons/icon3.svg",
      },
      {
        title: "Referral bonuses",
        description: "Performance bonuses and bring-a-friend rewards that boost your monthly pay.",
        icon: "/icons/icon2.svg",
      },
    ],
  },
  couriers: {
    missionPerksExtra: [
      {
        title: "Route app guidance",
        description: "Clear navigation, order details, and support chat built into the courier app.",
        sticker: "/icons/come-to-the-store.svg",
      },
    ],
    trustExtra: [
      {
        title: "Yango Deli thermal bag",
        description: "Keep groceries and ready meals at the right temperature on every delivery.",
      },
      {
        title: "Peak-hour earnings",
        description: "Lunch, dinner, and weekend rush bonuses when demand is highest.",
      },
    ],
    benefitsExtra: [
      {
        title: "Route support",
        description: "In-app navigation plus managers and support reps one message away.",
        icon: "/icons/wait-for-the-call.svg",
      },
      {
        title: "Thermal equipment",
        description: "Yango Deli bags and gear so orders arrive fresh at the doorstep.",
        icon: "/icons/come-to-the-store.svg",
      },
      {
        title: "No weekly minimum",
        description: "Choose shifts that fit your life — days and hours are yours to decide.",
        icon: "/icons/Flexible-shifts.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Referral bonus",
        description: "Know a great rider? Refer them to Yango Deli and earn when they start.",
        image: "/images/Group-2087327955-1.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Vehicle registration",
        description: "Register your e-bike, scooter, or car and get approved within days.",
        icon: "/icons/icon3.svg",
      },
      {
        title: "First shift support",
        description: "Briefing, bag pickup, and a support line for your first routes on the road.",
        icon: "/icons/training.svg",
      },
    ],
  },
  support: {
    missionPerksExtra: [
      {
        title: "Knowledge base & tools",
        description: "Product guides, policies, and CRM tools so you answer with confidence.",
        sticker: "/icons/icon1.svg",
      },
    ],
    trustExtra: [
      {
        title: "Hebrew, English & Russian",
        description: "Serve customers in the language you know best — all three are welcome.",
      },
      {
        title: "Career inside Yango",
        description: "Team leads started as agents — clear paths to coaching and management roles.",
      },
    ],
    benefitsExtra: [
      {
        title: "Chat & phone channels",
        description: "Help shoppers, couriers, and branch teams through modern support tools.",
        icon: "/icons/wait-for-the-call.svg",
      },
      {
        title: "Coaching on every shift",
        description: "Team leads review cases with you and help you grow your service skills.",
        icon: "/icons/training.svg",
      },
      {
        title: "Performance bonuses",
        description: "Quality and availability rewards that meaningfully boost monthly pay.",
        icon: "/icons/icon2.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Young team culture",
        description: "Work with a dynamic team ages 18+ in a fast-growing Israeli retail brand.",
        image: "/images/Group-2087327983.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Remote interview",
        description: "Apply online and interview from home — no branch commute required.",
        icon: "/icons/icon4.svg",
      },
      {
        title: "Shadow shifts",
        description: "Listen to live cases with a team lead before you take your first ticket solo.",
        icon: "/icons/icon1.svg",
      },
    ],
  },
  manager: {
    missionPerksExtra: [
      {
        title: "Live operations dashboard",
        description: "Track order peaks, staffing, and quality metrics in real time during every shift.",
        sticker: "/icons/icon2.svg",
      },
    ],
    trustExtra: [
      {
        title: "Coach your team",
        description: "Train pickers, set the floor standard, and build a shift culture people want to join.",
      },
      {
        title: "Regional mentorship",
        description: "Operations leaders invest in your management skills with regular feedback.",
      },
    ],
    benefitsExtra: [
      {
        title: "Staffing & quality",
        description: "Own picker schedules, quality checks, and customer issue resolution each shift.",
        icon: "/icons/icon2.svg",
      },
      {
        title: "Operations reporting",
        description: "Blend floor leadership with remote planning and shift performance reviews.",
        icon: "/icons/icon4.svg",
      },
      {
        title: "Training budget",
        description: "Company investment in your leadership development and branch certifications.",
        icon: "/icons/training.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Internal promotions",
        description: "Move up to senior shift lead, trainer, or regional operations inside Yango Deli.",
        image: "/images/Group-2087327955-1.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Shadow at your branch",
        description: "Onboard with experienced managers before you run your first solo shift.",
        icon: "/icons/training.svg",
      },
      {
        title: "Operations interview",
        description: "Meet regional leadership, align on expectations, and pick your home branch.",
        icon: "/icons/icon1.svg",
      },
    ],
  },
};

const RU = {
  pickers: {
    missionPerksExtra: [
      {
        title: "Свежие продукты и готовая еда",
        description: "Собирайте овощи, товары первой необходимости и готовые блюда в каждом заказе.",
        sticker: "/icons/icon1.svg",
      },
    ],
    trustReplace: [
      {
        title: "Активные смены",
        description: "Вы в движении по магазину — не за экраном. Каждый заказ — маленькая миссия.",
      },
      {
        title: "Филиалы рядом с домом",
        description: "Сеть дарксторов по всей стране — без долгих поездок.",
      },
      {
        title: "Команда поддержки",
        description: "Менеджеры и наставники помогают освоить пол с первого дня.",
      },
      {
        title: "Карьерный рост",
        description: "Путь от сборщика до менеджера смены внутри Yango Deli.",
      },
      {
        title: "Свежие продукты и готовая еда",
        description: "Качество, которое чувствуют клиенты — от овощей до горячих блюд.",
      },
      {
        title: "Комнаты отдыха",
        description: "В каждом филиале есть всё для нормального перерыва.",
      },
    ],
    benefitsExtra: [
      {
        title: "Контроль качества",
        description: "Проверяйте сроки годности и состояние товаров перед отправкой.",
        icon: "/icons/icon2.svg",
      },
      {
        title: "Ритм команды",
        description: "Работа в связке со сборщиками, менеджерами и курьерами.",
        icon: "/icons/young-team.svg",
      },
      {
        title: "Стабильный график",
        description: "Утренние, вечерние и выходные смены по вашему плану.",
        icon: "/icons/Flexible-shifts.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Приведи друга",
        description: "Бонус, когда приглашённый кандидат выходит на смену.",
        image: "/images/Group-2087327955-1.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Скидка 30%",
        description: "На продукты самовывоза в перерыве или после смены.",
        icon: "/icons/icon3.svg",
      },
      {
        title: "Реферальные бонусы",
        description: "Бонусы за результат и приведённых друзей.",
        icon: "/icons/icon2.svg",
      },
    ],
  },
  couriers: {
    missionPerksExtra: [
      {
        title: "Навигация в приложении",
        description: "Маршруты, детали заказа и чат поддержки прямо в курьерском приложении.",
        sticker: "/icons/come-to-the-store.svg",
      },
    ],
    trustExtra: [
      {
        title: "Термосумка Yango Deli",
        description: "Продукты и готовая еда остаются свежими на всём маршруте.",
      },
      {
        title: "Доплаты в пиковые часы",
        description: "Бонусы за обед, ужин и выходные, когда спрос максимальный.",
      },
    ],
    benefitsExtra: [
      {
        title: "Поддержка на маршруте",
        description: "Навигация в приложении и менеджеры на связи в один клик.",
        icon: "/icons/wait-for-the-call.svg",
      },
      {
        title: "Термоэкипировка",
        description: "Сумки и снаряжение Yango Deli — заказы приезжают свежими.",
        icon: "/icons/come-to-the-store.svg",
      },
      {
        title: "Без минимума смен",
        description: "Выбирайте дни и часы под свой график — без обязательного минимума.",
        icon: "/icons/Flexible-shifts.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Реферальный бонус",
        description: "Приведите хорошего курьера — получите бонус, когда он выйдет на смену.",
        image: "/images/Group-2087327955-1.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Регистрация транспорта",
        description: "Зарегистрируйте велосипед, скутер или авто — одобрение за несколько дней.",
        icon: "/icons/icon3.svg",
      },
      {
        title: "Поддержка на первой смене",
        description: "Инструктаж, выдача сумки и линия поддержки для первых маршрутов.",
        icon: "/icons/training.svg",
      },
    ],
  },
  support: {
    missionPerksExtra: [
      {
        title: "База знаний и инструменты",
        description: "Гайды по продуктам, политики и CRM — отвечайте уверенно с первого дня.",
        sticker: "/icons/icon1.svg",
      },
    ],
    trustExtra: [
      {
        title: "Иврит, английский и русский",
        description: "Общайтесь с клиентами на языке, который знаете лучше всего.",
      },
      {
        title: "Карьера внутри Yango",
        description: "Тимлиды начинали как агенты — путь к коучингу и менеджменту.",
      },
    ],
    benefitsExtra: [
      {
        title: "Чат и телефон",
        description: "Помогайте покупателям, курьерам и филиалам через современные инструменты.",
        icon: "/icons/wait-for-the-call.svg",
      },
      {
        title: "Коучинг на каждой смене",
        description: "Тимлиды разбирают кейсы и помогают расти в сервисе.",
        icon: "/icons/training.svg",
      },
      {
        title: "Бонусы за результат",
        description: "Награды за качество и доступность — ощутимый прирост к зарплате.",
        icon: "/icons/icon2.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Молодая команда",
        description: "Динамичная среда 18+ в быстрорастущем ритейл-бренде Израиля.",
        image: "/images/Group-2087327983.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Удалённое собеседование",
        description: "Подайте заявку онлайн и пройдите интервью из дома — без поездок в филиал.",
        icon: "/icons/icon4.svg",
      },
      {
        title: "Смены с наставником",
        description: "Слушайте живые кейсы с тимлидом перед первым самостоятельным тикетом.",
        icon: "/icons/icon1.svg",
      },
    ],
  },
  manager: {
    missionPerksExtra: [
      {
        title: "Дашборд операций",
        description: "Пики заказов, штат и качество в реальном времени на каждой смене.",
        sticker: "/icons/icon2.svg",
      },
    ],
    trustExtra: [
      {
        title: "Развивайте команду",
        description: "Обучайте сборщиков, задавайте стандарт пола и атмосферу смены.",
      },
      {
        title: "Наставничество от регионала",
        description: "Руководители операций помогают расти в менеджменте с регулярной обратной связью.",
      },
    ],
    benefitsExtra: [
      {
        title: "Штат и качество",
        description: "Графики сборщиков, проверки качества и решение проблем клиентов на смене.",
        icon: "/icons/icon2.svg",
      },
      {
        title: "Операционная отчётность",
        description: "Лидерство на полу плюс планирование и разбор результатов смен.",
        icon: "/icons/icon4.svg",
      },
      {
        title: "Бюджет на обучение",
        description: "Инвестиции компании в ваше развитие как руководителя.",
        icon: "/icons/training.svg",
      },
    ],
    whyJoinExtra: [
      {
        title: "Внутренние повышения",
        description: "Путь к старшему смене, тренеру или региональным операциям в Yango Deli.",
        image: "/images/Group-2087327955-1.png",
      },
    ],
    howItWorksExtra: [
      {
        title: "Стажировка в филиале",
        description: "Наблюдайте за опытными менеджерами перед первой самостоятельной сменой.",
        icon: "/icons/training.svg",
      },
      {
        title: "Собеседование с операциями",
        description: "Встреча с региональным руководством и выбор домашнего филиала.",
        icon: "/icons/icon1.svg",
      },
    ],
  },
};

for (const [file, patches] of [
  ["en.json", EN],
  ["ru.json", RU],
  ["he.json", EN],
]) {
  const data = JSON.parse(readFileSync(`src/messages/${file}`, "utf8"));
  for (const roleKey of Object.keys(patches)) {
    apply(data.roles[roleKey], patches[roleKey]);
  }
  writeFileSync(`src/messages/${file}`, `${JSON.stringify(data, null, 2)}\n`);
}

console.log("Done");
