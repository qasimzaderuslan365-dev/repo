
import React from 'react';
import { Profile, Review, Language } from './types';

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'p1',
    name: 'Elvin Məmmədov',
    role: 'PROFESSIONAL',
    skills: ['Santexnik', 'Təmir', 'Boru təmiri'],
    bio: '10 ildən çox təcrübəli santexnik ustasıyam. Hər növ boru və kran təmirini yüksək keyfiyyətlə yerinə yetirirəm.',
    hourlyRate: 25,
    rating: 4.8,
    reviewsCount: 42,
    avatar: 'https://picsum.photos/id/1012/200/200',
    location: 'Bakı, Nərimanov',
    availability: ['Bazar ertəsi', 'Çərşənbə', 'Cümə'],
    joinedDate: '2023-01-15'
  },
  {
    id: 'p2',
    name: 'Leyla Əliyeva',
    role: 'PROFESSIONAL',
    skills: ['Təmizlik', 'Ev yığışdırma', 'Pəncərə yuma'],
    bio: 'Evinizin təmizliyini mənə etibar edin. Professional avadanlıqlarla xidmət göstərirəm.',
    hourlyRate: 15,
    rating: 4.9,
    reviewsCount: 128,
    avatar: 'https://picsum.photos/id/1027/200/200',
    location: 'Bakı, Yasamal',
    availability: ['Hər gün'],
    joinedDate: '2022-11-20'
  },
  {
    id: 'p3',
    name: 'Tural Hüseynov',
    role: 'PROFESSIONAL',
    skills: ['Elektrik', 'Quraşdırma', 'Kabel təmiri'],
    bio: 'Professional elektrik xidməti. Təhlükəsizlik qaydalarına tam riayət edirəm.',
    hourlyRate: 30,
    rating: 4.7,
    reviewsCount: 56,
    avatar: 'https://picsum.photos/id/1005/200/200',
    location: 'Bakı, Səbail',
    availability: ['Bazar ertəsi', 'Cümə axşamı', 'Şənbə'],
    joinedDate: '2023-03-10'
  }
];

export const I18N = {
  az: {
    heroTitle: "Eviniz üçün ən yaxşı köməkçiləri tapın",
    heroSubtitle: "Peşəkar santexniklər, elektriklər və təmizlikçilər bir klik uzaqlığında.",
    searchPlaceholder: "Nə xidmət lazımdır? (məs: santexnik, təmizlik)",
    popularCategories: "Populyar Kateqoriyalar",
    plumbing: "Santexnik",
    cleaning: "Təmizlik",
    electrician: "Elektrik",
    renovation: "Təmir",
    searchBtn: "Axtar",
    hourlyRate: "Saatlıq tarif",
    viewProfile: "Profilə bax",
    makeOffer: "Təklif et",
    myOffers: "Sifarişlərim",
    becomePro: "Usta ol",
    login: "Giriş",
    home: "Ana səhifə",
    azn: "AZN"
  },
  en: {
    heroTitle: "Find the best helpers for your home",
    heroSubtitle: "Professional plumbers, electricians, and cleaners are just a click away.",
    searchPlaceholder: "What service do you need? (e.g., plumber, cleaning)",
    popularCategories: "Popular Categories",
    plumbing: "Plumbing",
    cleaning: "Cleaning",
    electrician: "Electrician",
    renovation: "Renovation",
    searchBtn: "Search",
    hourlyRate: "Hourly rate",
    viewProfile: "View Profile",
    makeOffer: "Make Offer",
    myOffers: "My Offers",
    becomePro: "Become Professional",
    login: "Login",
    home: "Home",
    azn: "AZN"
  },
  ru: {
    heroTitle: "Найдите лучших помощников для вашего дома",
    heroSubtitle: "Профессиональные сантехники, электрики и уборщики на расстоянии одного клика.",
    searchPlaceholder: "Какая услуга вам нужна? (напр: сантехник, уборка)",
    popularCategories: "Популярные Категории",
    plumbing: "Сантехник",
    cleaning: "Уборка",
    electrician: "Электрик",
    renovation: "Ремонт",
    searchBtn: "Поиск",
    hourlyRate: "Почасовая ставка",
    viewProfile: "Профиль",
    makeOffer: "Предложить",
    myOffers: "Мои заказы",
    becomePro: "Стать мастером",
    login: "Вход",
    home: "Главная",
    azn: "AZN"
  }
};
