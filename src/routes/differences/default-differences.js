const url = 'https://finddifferences.club/images/'

export const defaultDifferences =[    
    {               
        id: 0,
        imgList: `${url}/bambi` + '_list.png',                   
        imgDescr: `${url}/bambi` + '_descr.png',
        imgOriginal: `${url}/bambi` + '_original.png',
        imgFake: `${url}/bambi` + '_fake.png',
        defaultLife: 3, 
        life: 3,    
        defaultHint: 2,
        hint: 2,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 21, y: 46,
                isFound: false
            },
            {
                id: 1,
                x: 56, y: 46,
                isFound: false
            },
            {
                id: 2,
                x: 78, y: 22,
                isFound: false
            }, 
            {
                id: 3,
                x: 82, y: 58,
                isFound: false
            },
            {
                id: 4,
                x: 34, y: 56,
                isFound: false
            }
        ]
    },
    {               
        id: 1,    
        imgList: `${url}/butterfly` + '_list.png',                   
        imgDescr: `${url}/butterfly` + '_descr.png',
        imgOriginal: `${url}/butterfly` + '_original.png',
        imgFake: `${url}/butterfly` + '_fake.png',
        defaultLife: 3, 
        life: 3,
        defaultHint: 2,
        hint: 2,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 18, y: 12,
                isFound: false
            },
            {
                id: 1,
                x: 20, y: 35,
                isFound: false
            },
            {
                id: 2,
                x: 49, y: 33,
                isFound: false
            }, 
            {
                id: 3,
                x: 72, y: 20,                        
                isFound: false
            },
            {
                id: 4,
                x: 83, y: 58,
                isFound: false
            }
        ]
    },
    {               
        id: 2,    
        imgList: `${url}/wineglass` + '_list.png',                   
        imgDescr: `${url}/wineglass` + '_descr.png',
        imgOriginal: `${url}/wineglass` + '_original.png',
        imgFake: `${url}/wineglass` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 2,
        life: 3,
        hint: 2,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 4, y: 62,
                isFound: false
            },
            {
                id: 1,
                x: 42, y: 19,
                isFound: false
            },
            {
                id: 2,
                x: 67, y: -1,
                isFound: false
            }, 
            {
                id: 3,
                x: 73, y: 40,                        
                isFound: false
            },
            {
                id: 4,
                x: 63, y: 71,
                isFound: false
            }
        ]
    },
    {               
        id: 3,    
        imgList: `${url}/landscape` + '_list.png',                   
        imgDescr: `${url}/landscape` + '_descr.png',
        imgOriginal: `${url}/landscape` + '_original.png',
        imgFake: `${url}/landscape` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 2,
        life: 3,
        hint: 2,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 0, y: 26,
                isFound: false
            },
            {
                id: 1,
                x: 20, y: 25,
                isFound: false
            },
            {
                id: 2,
                x: 42, y: 40,
                isFound: false
            }, 
            {
                id: 3,
                x: 73, y: 50,                        
                isFound: false
            },
            {
                id: 4,
                x: 82, y: 32,
                isFound: false
            }
        ]
    },
    {               
        id: 4,    
        imgList: `${url}/snake` + '_list.png',                   
        imgDescr: `${url}/snake` + '_descr.png',
        imgOriginal: `${url}/snake` + '_original.png',
        imgFake: `${url}/snake` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 2,
        life: 3,
        hint: 2,
        isPassed: false,
        points: [
            {
                id: 0,
                x: -4, y: 42,
                isFound: false
            },
            {
                id: 1,
                x: 21, y: 51,
                isFound: false
            },
            {
                id: 2,
                x: 39, y: 27,
                isFound: false
            }, 
            {
                id: 3,
                x: 64, y: 35,                        
                isFound: false
            },
            {
                id: 4,
                x: 86, y: 25,
                isFound: false
            }
        ]
    },                             
    {               
        id: 5,         
        imgList: `${url}/giraffe` + '_list.png',                   
        imgDescr: `${url}/giraffe` + '_descr.png',
        imgOriginal: `${url}/giraffe` + '_original.png',
        imgFake: `${url}/giraffe` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 3, y: 15,
                isFound: false
            },
            {
                id: 1,
                x: 3, y: 42,
                isFound: false
            },
            {
                id: 2,
                x: 32, y: 13,
                isFound: false
            }, 
            {
                id: 3,
                x: 20, y: 70,                        
                isFound: false
            },
            {
                id: 4,
                x: 77, y: 26,
                isFound: false
            }
        ]
    },
    {               
        id: 6,    
        imgList: `${url}/tiger` + '_list.png',                   
        imgDescr: `${url}/tiger` + '_descr.png',
        imgOriginal: `${url}/tiger` + '_original.png',
        imgFake: `${url}/tiger` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 12, y: 8,
                isFound: false
            },
            {
                id: 1,
                x: 71, y: 55,
                isFound: false
            },
            {
                id: 2,
                x: 46, y: 31,
                isFound: false
            }, 
            {
                id: 3,
                x: 26, y: 69,                        
                isFound: false
            },
            {
                id: 4,
                x: 82, y: 17,
                isFound: false
            }
        ]
    },
    {               
        id: 7,    
        imgList: `${url}/bike` + '_list.png',                   
        imgDescr: `${url}/bike` + '_descr.png',
        imgOriginal: `${url}/bike` + '_original.png',
        imgFake: `${url}/bike` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 12, y: 13,
                isFound: false
            },
            {
                id: 1,
                x: 33, y: 44,
                isFound: false
            },
            {
                id: 2,
                x: 52, y: 22,
                isFound: false
            }, 
            {
                id: 3,
                x: 71, y: 30,                        
                isFound: false
            },
            {
                id: 4,
                x: 82, y: 47,
                isFound: false
            }
        ]
    },
    {               
        id: 8,    
        imgList: `${url}/estetic` + '_list.png',                   
        imgDescr: `${url}/estetic` + '_descr.png',
        imgOriginal: `${url}/estetic` + '_original.png',
        imgFake: `${url}/estetic` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 25, y: 13,
                isFound: false
            },
            {
                id: 1,
                x: 36, y: 23,
                isFound: false
            },
            {
                id: 2,
                x: 20, y: 43,
                isFound: false
            }, 
            {
                id: 3,
                x: 82, y: -3,                        
                isFound: false
            },
            {
                id: 4,
                x: 65, y: 55,
                isFound: false
            }
        ]
    },                                       
    
    {               
        id: 9,      
        imgList: `${url}/boat` + '_list.png',                   
        imgDescr: `${url}/boat` + '_descr.png',
        imgOriginal: `${url}/boat` + '_original.png',
        imgFake: `${url}/boat` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: -2, y: 28,
                isFound: false
            },
            {
                id: 1,
                x: 34, y: -4,
                isFound: false
            },
            {
                id: 2,
                x: 35, y: 24,
                isFound: false
            }, 
            {
                id: 3,
                x: 88, y: 55,                        
                isFound: false
            },
            {
                id: 4,
                x: 50, y: 81,
                isFound: false
            }
        ]
    },   
    {               
        id: 10,      
        imgList: `${url}/spiderman` + '_list.png',                   
        imgDescr: `${url}/spiderman` + '_descr.png',
        imgOriginal: `${url}/spiderman` + '_original.png',
        imgFake: `${url}/spiderman` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: -4, y: 78,
                isFound: false
            },
            {
                id: 1,
                x: 36, y: 85,
                isFound: false
            },
            {
                id: 2,
                x: 46, y: 50,
                isFound: false
            }, 
            {
                id: 3,
                x: 66, y: 57,                        
                isFound: false
            },
            {
                id: 4,
                x: 22, y: 46,
                isFound: false
            }
        ]
    },   
    {               
        id: 11,      
        imgList: `${url}/many-cars` + '_list.png',                   
        imgDescr: `${url}/many-cars` + '_descr.png',
        imgOriginal: `${url}/many-cars` + '_original.png',
        imgFake: `${url}/many-cars` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 3, y: 74,
                isFound: false
            },
            {
                id: 1,
                x: 19, y: 16,
                isFound: false
            },
            {
                id: 2,
                x: 63, y: -2,
                isFound: false
            }, 
            {
                id: 3,
                x: 69, y: 33,                        
                isFound: false
            },
            {
                id: 4,
                x: 84, y: 79,
                isFound: false
            }
        ]
    },                       
    {               
        id: 12,      
        imgList: `${url}/many-boats` + '_list.png',                   
        imgDescr: `${url}/many-boats` + '_descr.png',
        imgOriginal: `${url}/many-boats` + '_original.png',
        imgFake: `${url}/many-boats` + '_fake.png',
        defaultLife: 3, 
        defaultHint: 1,
        life: 3,
        hint: 1,
        isPassed: false,
        points: [
            {
                id: 0,
                x: 0, y: 49,
                isFound: false
            },
            {
                id: 1,
                x: 50, y: 19,
                isFound: false
            },
            {
                id: 2,
                x: 29, y: 18,
                isFound: false
            }, 
            {
                id: 3,
                x: 84, y: 64,                        
                isFound: false
            },
            {
                id: 4,
                x: 44, y: 79,
                isFound: false
            }
        ]
    }                                           
]