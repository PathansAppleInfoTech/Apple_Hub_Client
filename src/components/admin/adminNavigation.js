import {
    DashboardIcon,
    ServicesIcon,
    CategoriesIcon,
    OrdersIcon,
    TeamIcon,
} from './AdminIcons';

export const ADMIN_NAV_ITEMS = [
    {
        to: '/admin/dashboard',
        label: 'Dashboard',
        icon: DashboardIcon,
    },
    {
        to: '/admin/services',
        label: 'Services',
        icon: ServicesIcon,
        adminOnly: true,
    },
    {
        to: '/admin/categories',
        label: 'Categories',
        icon: CategoriesIcon,
        adminOnly: true,
    },
    {
        to: '/admin/orders',
        label: 'Orders',
        icon: OrdersIcon,
    },
    {
        to: '/admin/team',
        label: 'Team',
        icon: TeamIcon,
        adminOnly: true,
    },
];