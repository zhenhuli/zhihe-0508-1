const photos = [
  {
    id: 1,
    url: 'https://picsum.photos/800/600?random=1',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    title: '春日郊游',
    description: '和家人一起在公园赏花',
    date: '2024-03-15',
    year: 2024,
    month: 3,
    height: 300
  },
  {
    id: 2,
    url: 'https://picsum.photos/800/1000?random=2',
    thumbnail: 'https://picsum.photos/400/500?random=2',
    title: '山间日出',
    description: '清晨登山看到的壮丽日出',
    date: '2024-03-20',
    year: 2024,
    month: 3,
    height: 500
  },
  {
    id: 3,
    url: 'https://picsum.photos/800/700?random=3',
    thumbnail: 'https://picsum.photos/400/350?random=3',
    title: '海边日落',
    description: '夕阳下的海岸线',
    date: '2024-04-05',
    year: 2024,
    month: 4,
    height: 350
  },
  {
    id: 4,
    url: 'https://picsum.photos/800/900?random=4',
    thumbnail: 'https://picsum.photos/400/450?random=4',
    title: '城市夜景',
    description: '繁华都市的霓虹灯光',
    date: '2024-04-12',
    year: 2024,
    month: 4,
    height: 450
  },
  {
    id: 5,
    url: 'https://picsum.photos/800/550?random=5',
    thumbnail: 'https://picsum.photos/400/275?random=5',
    title: '古镇风情',
    description: '漫步在江南水乡',
    date: '2024-05-01',
    year: 2024,
    month: 5,
    height: 275
  },
  {
    id: 6,
    url: 'https://picsum.photos/800/650?random=6',
    thumbnail: 'https://picsum.photos/400/325?random=6',
    title: '花海漫步',
    description: '薰衣草田的浪漫时光',
    date: '2024-05-18',
    year: 2024,
    month: 5,
    height: 325
  },
  {
    id: 7,
    url: 'https://picsum.photos/800/800?random=7',
    thumbnail: 'https://picsum.photos/400/400?random=7',
    title: '星空银河',
    description: '郊外的璀璨星空',
    date: '2024-06-10',
    year: 2024,
    month: 6,
    height: 400
  },
  {
    id: 8,
    url: 'https://picsum.photos/800/750?random=8',
    thumbnail: 'https://picsum.photos/400/375?random=8',
    title: '雨后彩虹',
    description: '雨后的七色彩虹',
    date: '2024-06-25',
    year: 2024,
    month: 6,
    height: 375
  },
  {
    id: 9,
    url: 'https://picsum.photos/800/500?random=9',
    thumbnail: 'https://picsum.photos/400/250?random=9',
    title: '秋叶金黄',
    description: '满山的金色枫叶',
    date: '2023-10-15',
    year: 2023,
    month: 10,
    height: 250
  },
  {
    id: 10,
    url: 'https://picsum.photos/800/680?random=10',
    thumbnail: 'https://picsum.photos/400/340?random=10',
    title: '冬日雪景',
    description: '银装素裹的世界',
    date: '2023-12-20',
    year: 2023,
    month: 12,
    height: 340
  },
  {
    id: 11,
    url: 'https://picsum.photos/800/620?random=11',
    thumbnail: 'https://picsum.photos/400/310?random=11',
    title: '春节团圆',
    description: '一家人的年夜饭',
    date: '2024-02-10',
    year: 2024,
    month: 2,
    height: 310
  },
  {
    id: 12,
    url: 'https://picsum.photos/800/950?random=12',
    thumbnail: 'https://picsum.photos/400/475?random=12',
    title: '登山望远',
    description: '站在山顶俯瞰群山',
    date: '2024-01-08',
    year: 2024,
    month: 1,
    height: 475
  },
  {
    id: 13,
    url: 'https://picsum.photos/800/580?random=13',
    thumbnail: 'https://picsum.photos/400/290?random=13',
    title: '湖边垂钓',
    description: '宁静的午后时光',
    date: '2023-09-05',
    year: 2023,
    month: 9,
    height: 290
  },
  {
    id: 14,
    url: 'https://picsum.photos/800/720?random=14',
    thumbnail: 'https://picsum.photos/400/360?random=14',
    title: '古城墙',
    description: '历史的印记',
    date: '2023-08-12',
    year: 2023,
    month: 8,
    height: 360
  },
  {
    id: 15,
    url: 'https://picsum.photos/800/850?random=15',
    thumbnail: 'https://picsum.photos/400/425?random=15',
    title: '摩天轮',
    description: '游乐园的欢乐时光',
    date: '2023-07-20',
    year: 2023,
    month: 7,
    height: 425
  }
];

export function getPhotosByYearMonth() {
  const grouped = {};
  
  photos.forEach(photo => {
    const key = `${photo.year}-${String(photo.month).padStart(2, '0')}`;
    if (!grouped[key]) {
      grouped[key] = {
        year: photo.year,
        month: photo.month,
        photos: []
      };
    }
    grouped[key].photos.push(photo);
  });

  return Object.values(grouped).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export function getAllPhotos() {
  return photos;
}

export function getMonthName(month) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return months[month - 1];
}
