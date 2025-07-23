import { matchPath } from "react-router";

const useMenuBreadcrumbs = (pathname, items) => {
  pathname = pathname.trim();

  const findParents = (items) => {
    if (!items) return [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.path && matchPath({ path: item.path, end: false }, pathname)) {
        return [
          {
            title: item.title,
            path: item.path,
            active: true,
          },
        ];
      } else if (item.children) {
        const parents = findParents(item.children);
        if (parents.length > 0) {
          return [item, ...parents];
        }
      }
    }
    return [];
  };

  const breadcrumbs = findParents(items);

  // 👇 Кастомные маршруты, которых нет в конфиге меню
  const customRoutes = [
    {
      match: "/tasks/create-update-tasks/:id?",
      crumbs: [
        { title: "Задания", path: "/tasks" },
        { title: "Настройки задания", path: pathname, active: true },
      ],
    },
    {
      match: "/faq/create-update-question/:id?",
      crumbs: [
        { title: "FAQ", path: "/faq" },
        {
          title: "Создание / редактирование вопроса",
          path: pathname,
          active: true,
        },
      ],
    },
    {
      match: "/documentation/create-update-documentation/:id?",
      crumbs: [
        { title: "Документация", path: "/documentation" },
        {
          title: "Создание / редактирование документа",
          path: pathname,
          active: true,
        },
      ],
    },
    {
      match: "/mailing/create-update-mailing/:id?",
      crumbs: [
        { title: "Рассылки", path: "/mailing" },
        {
          title: "Настройки рассылок",
          path: pathname,
          active: true,
        },
      ],
    },
    {
      match: "/giveaways/settings-giveaway/:id?",
      crumbs: [
        { title: "Конкурсы", path: "/giveaways" },
        {
          title: "Настройки конкурса",
          path: pathname,
          active: true,
        },
      ],
    },
    {
      match: "/giveaways/participants/:id?",
      crumbs: (() => {
        // Извлекаем id из pathname
        const match = pathname.match(/\/giveaways\/participants\/(\d+)/);
        const id = match ? match[1] : "";
        return [
          { title: "Конкурсы", path: "/giveaways" },
          {
            title: "Настройки конкурса",
            path: `/giveaways/settings-giveaway/${id}`,
          },
          {
            title: "Список участников",
            path: pathname,
            active: true,
          },
        ];
      })(),
    },
  ];

  for (const route of customRoutes) {
    if (matchPath({ path: route.match, end: true }, pathname)) {
      return route.crumbs;
    }
  }

  return breadcrumbs;
};

export { useMenuBreadcrumbs };
