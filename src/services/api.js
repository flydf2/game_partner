// API服务层
import { handleApiError } from '../utils/errorHandler'

// 基础URL
const BASE_URL = 'https://api.example.com/v1';

// 模拟数据加载延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API响应
const mockData = {
  games: [
    { id: 1, name: 'LOL', icon: 'videogame_asset' },
    { id: 2, name: 'Valorant', icon: 'target' },
    { id: 3, name: '王者荣耀', icon: 'shield' },
    { id: 4, name: '原神', icon: 'auto_awesome' },
    { id: 5, name: 'CS:GO', icon: 'sports_esports' },
    { id: 6, name: 'DOTA2', icon: 'fitness_center' }
  ],
  playmates: [
    {
      id: 1,
      name: '林间小鹿',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
      rating: 5.0,
      tags: ['王者', '萌妹'],
      price: 45
    },
    {
      id: 2,
      name: '影子猎手',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
      rating: 4.9,
      tags: ['国服第一', '技术流'],
      price: 60
    },
    {
      id: 3,
      name: '安妮喵呜',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDI76aOeylc3VRSRNZ04zYnjdju83SPGLpYh8d2uB5bogOv5w6wJcvfx6AJMDR5RQKBUrAlNQptRHNf3XJ61WGVmFOAc3-gFksvrlt6w6F_TaBfQ6Mij2zaM_KjWfcqlVkL82KYbgijsqdy-ptNMAsnQRBVHpqk2dGVjd6UsWwcuOnY9ToQPlAZwJXaT0sdGvDFkoLuAn_IIt1cP9aJJ9LXF0dXPKQK0bAJi57JnH1pgIKL4F5lFuQICzWqRy0VNT1R6BfwuOFvKg',
      description: '累计陪玩 1,200+ 小时',
      tags: ['温柔语聊', '绝地求生'],
      price: 55
    },
    {
      id: 4,
      name: '电竞少女',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 4.8,
      tags: ['LOL', '技术流'],
      price: 48
    },
    {
      id: 5,
      name: '游戏大师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      rating: 4.7,
      tags: ['CS:GO', '吃鸡'],
      price: 52
    }
  ]
};

// API请求函数
const request = async (url, options = {}) => {
  try {
    // 模拟网络延迟
    await delay(500);
    
    // 模拟API响应
    if (url.includes('/games')) {
      return { success: true, data: mockData.games };
    } else if (url.includes('/playmates')) {
      return { success: true, data: mockData.playmates };
    } else {
      throw new Error('API路径不存在');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// 具体API方法
export const api = {
  // 获取游戏分类
  getGames: async () => {
    return request(`${BASE_URL}/games`);
  },
  
  // 获取陪玩列表
  getPlaymates: async (params = {}) => {
    return request(`${BASE_URL}/playmates`, { params });
  },
  
  // 获取特色陪玩
  getFeaturedPlaymate: async () => {
    const response = await request(`${BASE_URL}/playmates`);
    if (response.success) {
      return { success: true, data: response.data[2] }; // 返回第三个陪玩作为特色
    }
    return response;
  }
};