const sampleData = {
    works: [{
        _id: "1",
        code: "NM001",
        name: "Nhà máy CRSX",
        worksManager: "Nguyễn Anh Phương",
        foreman: "Phạm Đại Tài",
        manufacturingMills: [{
            _id: "1",
            name: "Xưởng thuốc cốm"
        }, {
            _id: "2",
            name: "Xưởng thuốc viên"
        }],
        phoneNumber: "0337479966",
        status: 1,
        address: "Nhân Chính, Thanh Xuân, Hà Nội",
        description: "Nhà máy sản xuất thực phẩm chức năng",
        createdAt: "03-06-2020 12:00:00",
        updatedAt: "02-10-2020 13:00:00"
    }, {
        _id: "2",
        code: "NM002",
        name: "Nhà máy OSAKA",
        worksManager: "Nguyễn Văn Thắng",
        foreman: "Trịnh Công Sơn",
        manufacturingMills: [{
            _id: "3",
            name: "Xưởng thuốc tiêm"
        }, {
            _id: "4",
            name: "Xưởng thuốc bột"
        }],
        phoneNumber: "0372109881",
        status: 1,
        address: "Trung Hòa, Cầu Giấy, Hà Nội",
        description: "Nhà máy sản xuất thuốc thú y",
        createdAt: "03-06-2020 12:00:00",
        updatedAt: "02-10-2020 13:00:00"
    }],

    mills: [{
        _id: "1",
        code: "XSX 001",
        name: "Xưởng thuốc cốm",
        manufacturingWorks: {
            id: "1",
            name: "Nhà máy CRSX"
        },
        description: "Xưởng sản xuất thuốc cốm dạng hạt"

    }, {
        _id: "2",
        code: "XSX 002",
        name: "Xưởng thuốc viên",
        manufacturingWorks: {
            id: "1",
            name: "Nhà máy CRSX"
        },
        description: "Xưởng sản xuất thuốc viên con nhộng"
    }, {
        _id: "3",
        code: "XSX 003",
        name: "Xưởng thuốc tiêm",
        manufacturingWorks: {
            id: "2",
            name: "Nhà máy OSAKA",
        },
        description: "Xưởng sản xuất thuốc tiêm cho động vật"
    }, {
        _id: "4",
        code: "XSX 004",
        name: "Xưởng thuốc bột",
        manufacturingWorks: {
            id: "2",
            name: "Nhà máy OSAKA",
        },
        description: "Xưởng sản xuất thuốc bột cho động vật"
    }],

    purchasingRequests: [{
        _id: "1",
        code: "PDN 001",
        creator: {
            _id: "1",
            name: "Nguyen Anh Phương"
        },
        purpose: "Lập kế hoạch KH001",
        intendReceiveTime: "12-03-2020",
        status: 0,
        materials: [{
            name: "Dược liệu",
            code: "DL12220",
            baseUnit: "kg",
            quantity: 120,
        }, {
            name: "Tá liệu",
            code: "TL22211",
            baseUnit: "kg",
            quantity: 150,
        }, {
            name: "Vỏ cây thuốc",
            code: "VCT12230",
            baseUnit: "kg",
            quantity: 100,
        }
        ],
        description: "Phiếu tạo nguyên vật liệu mua hàng",
        createdAt: "10-3-2020",
        updatedAt: "10-3-2020 12:30:00"
    }, {
        _id: "2",
        code: "PDN 002",
        creator: {
            _id: "1",
            name: "Nguyen Anh Phương"
        },
        purpose: "Lập kế hoạch KH002",
        intendReceiveTime: "14-03-2020",
        status: 0,
        materials: [{
            name: "penicillin",
            code: "P110CF",
            baseUnit: "kg",
            quantity: 120,
        }, {
            name: "bột trắng",
            code: "BT210AC",
            baseUnit: "kg",
            quantity: 150,
        }, {
            name: "bột đỏ",
            code: "BD11200",
            baseUnit: "kg",
            quantity: 200,
        }
        ],
        description: "Phiếu tạo nguyên vật liệu mua hàng",
        createdAt: "11-3-2020",
        updatedAt: "11-3-2020 12:30:00"
    }, {
        _id: "3",
        code: "PDN 003",
        creator: {
            _id: "1",
            name: "Nguyen Anh Phương"
        },
        purpose: "Lập kế hoạch KH003",
        intendReceiveTime: "17-03-2020",
        status: 1,
        materials: [{
            name: "Nước cất",
            code: "NC11219",
            baseUnit: "lít",
            quantity: 200,
        }, {
            name: "Tinh dầu thô",
            code: "TDT1102",
            baseUnit: "lít",
            quantity: 250,
        }, {
            name: "Hộp đựng paracetamol",
            code: "PKP11100",
            baseUnit: "hộp",
            quantity: 150,
        }
        ],
        description: "Phiếu tạo nguyên vật liệu mua hàng",
        createdAt: "15-3-2020",
        updatedAt: "15-3-2020 12:30:00"
    }],
    manufacturingOrders: [{
        _id: "1",
        code: "DSX001",
        creator: {
            _id: "1",
            name: "Phạm Đại Tài",
        },
        deadline: "12-06-2020",
        type: "1",
        priority: "Rất cao",
        goods: [{
            good: {
                _id: 1,
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g",
                materials: [{
                    name: "Nước cất",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng paracetamol",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 1,
                }],
            },
            quantity: 100,
            planedQuantity: 0
        }, {
            good: {
                _id: 2,
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg",
                materials: [{
                    name: "Dầu dừa",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Bột lọc",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }],
            },
            quantity: 200,
            planedQuantity: 0
        }, {
            good: {
                _id: 3,
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g",
                materials: [{
                    name: "Nước cất loại 1",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hoa thảo nguyên",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng cấp 1",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 2,
                }],
            },
            quantity: 300,
            planedQuantity: 0
        }],
        description: "Đơn hàng sản xuất quan trọng phải lập ngay",
        status: "Đã lập kế hoạch",
        createdAt: "01-06-2020",
        updatedAt: ""
    }, {
        _id: "2",
        code: "DSX002",
        creator: {
            _id: "1",
            name: "Nguyễn Anh Phương",
        },
        deadline: "17-06-2020",
        type: "1",
        priority: "Cao",
        goods: [{
            good: {
                _id: 2,
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg",
                materials: [{
                    name: "Nước cất",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng paracetamol",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 1,
                }],
            },
            quantity: 200,
            planedQuantity: 0
        }, {
            good: {
                _id: 3,
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g",
                materials: [{
                    name: "Nước cất",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }],
            },
            quantity: 300,
            planedQuantity: 0
        }, {
            good: {
                _id: 4,
                code: "T004",
                name: "Thuốc tiêm lợn M3P",
                baseUnit: "gam",
                packingRule: "1Thùngx5Hộpx100g",
                materials: [{
                    name: "Nước cất",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng paracetamol",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 1,
                }],
            },
            quantity: 400,
            planedQuantity: 0
        }],
        description: "Đơn hàng sản xuất cho khác hàng vip",
        status: "Chưa lập kế hoạch",
        createdAt: "03-06-2020",
        updatedAt: ""
    }, {
        _id: "3",
        code: "DSX003",
        creator: {
            _id: "1",
            name: "Nguyễn Văn Thắng",
        },
        deadline: "18-06-2020",
        type: "1",
        priority: "Cao",
        goods: [{
            good: {
                _id: "1",
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g",
                materials: [{
                    name: "Bột thuốc trắng",
                    code: "NC1120",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng paracetamol",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 1,
                }],
            },
            quantity: 100,
            planedQuantity: 0
        }, {
            good: {
                _id: "2",
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg",
                materials: [{
                    name: "Nước cất",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng paracetamol",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 1,
                }],
            },
            quantity: 200,
            planedQuantity: 0
        }, {
            good: {
                _id: "3",
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g",
                materials: [{
                    name: "Nước cất",
                    code: "NC11219",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Tinh dầu thô",
                    code: "TDT1102",
                    baseUnit: "lít",
                    quantity: 2,
                }, {
                    name: "Hộp đựng paracetamol",
                    code: "PKP11100",
                    baseUnit: "hộp",
                    quantity: 1,
                }],
            },
            quantity: 300,
            planedQuantity: 100
        }],
        description: "Đơn hàng sản xuất trực tiếp cho bên công ty VNIST",
        status: "Đang lập kế hoạch",
        createdAt: "02-06-2020",
        updatedAt: ""
    }],

    manufacturingPlans: [{
        _id: "1",
        code: "KH 001",
        manufacturingOrder: {
            _id: "1",
            code: "DSX001"
        },
        goods: [{
            good: {
                _id: "1",
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g"
            },
            quantity: 1000,
            orderedQuantity: 8000
        }, {
            good: {
                _id: "2",
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200,
            orderedQuantity: 200
        }, {
            good: {
                _id: "3",
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 500,
            orderedQuantity: 400
        }],
        creator: {
            _id: "1",
            name: "Nguyễn Anh Phương"
        },
        startDate: "07-10-2020",
        endDate: "27-10-2020",
        description: "Kế hoạch sản xuất tuần 3 và tuần 4 tháng 10",
        logs: [{
            creator: {
                id: "1",
                name: "Nguyễn Anh Phương"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003"
        }, {
            creator: {
                id: "1",
                name: "Nguyễn Anh Phương"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500"
        }],
        createdAt: "04-10-2020",
        updatedAt: "06-10-2020",
        status: "Đang thực hiện"
    }, {
        _id: "2",
        code: "KH 002",
        manufacturingOrder: {
            _id: "1",
            code: "DSX001"
        },
        goods: [{
            good: {
                _id: "1",
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g"
            },
            quantity: 1000,
            orderedQuantity: 8000
        }, {
            good: {
                _id: "2",
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200,
            orderedQuantity: 200
        }, {
            good: {
                _id: "3",
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 500,
            orderedQuantity: 400
        }],
        creator: {
            _id: "1",
            name: "Nguyễn Anh Phương"
        },
        startDate: "07-10-2020",
        endDate: "27-10-2020",
        description: "Kế hoạch sản xuất tuần 3 và tuần 4 tháng 10",
        logs: [{
            creator: {
                id: "1",
                name: "Nguyễn Anh Phương"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003"
        }, {
            creator: {
                id: "1",
                name: "Nguyễn Anh Phương"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500"
        }],
        createdAt: "04-10-2020",
        updatedAt: "06-10-2020",
        status: "Chưa được duyệt"
    }, {
        _id: "3",
        code: "KH 003",
        manufacturingOrder: {
            _id: "2",
            code: "DSX002"
        },
        goods: [{
            good: {
                _id: "1",
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g"
            },
            quantity: 1000,
            orderedQuantity: 8000
        }, {
            good: {
                _id: "2",
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200,
            orderedQuantity: 200
        }, {
            good: {
                _id: "3",
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 500,
            orderedQuantity: 400
        }],
        creator: {
            _id: "1",
            name: "Phạm Đạt Tài"
        },
        startDate: "07-10-2020",
        endDate: "27-10-2020",
        description: "Kế hoạch sản xuất tuần 3 và tuần 4 tháng 10",
        logs: [{
            creator: {
                id: "1",
                name: "Phạm Đạt Tài"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003"
        }, {
            creator: {
                id: "1",
                name: "Phạm Đạt Tài"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500"
        }],
        createdAt: "04-10-2020",
        updatedAt: "06-10-2020",
        status: "Đã hoàn thành"
    }, {
        _id: "4",
        code: "KH 004",
        goods: [{
            good: {
                _id: "1",
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g"
            },
            quantity: 1000,
            orderedQuantity: 8000
        }, {
            good: {
                _id: "2",
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200,
            orderedQuantity: 200
        }, {
            good: {
                _id: "3",
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 500,
            orderedQuantity: 400
        }],
        creator: {
            _id: "1",
            name: "Nguyễn Anh Phương"
        },
        startDate: "01-11-2020",
        endDate: "08-11-2020",
        description: "Kế hoạch sản xuất tuần 1 tháng 11 năm 2020",
        logs: [{
            creator: {
                id: "1",
                name: "Nguyễn Anh Phương"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003"
        }, {
            creator: {
                id: "1",
                name: "Nguyễn Anh Phương"
            },
            createdAt: "06-10-2020",
            title: "Sửa thuộc tính mặt hàng",
            description: "Sửa số lượng thực tế sản xuất từ 500 thành 400 của mặt hàng T003"
        }],
        createdAt: "04-10-2020",
        updatedAt: "06-10-2020",
        status: "Đã hủy"
    }],

    manufacturingCommands: [{
        _id: "1",
        code: "LSX001",
        manufacturingPlan: {
            _id: "1",
            code: "KH001"
        },
        startDate: "10/10/2020",
        endDate: "20/10/2020",
        startTurn: "1",
        endTurn: "3",
        good: {
            _id: "1",
            name: "penicillin",
        },
        quantity: 100,
        manufacturingMill: {
            _id: "1",
            code: "XSX001",
            name: "Nhà máy thuốc thú y"
        },
        creator: {
            _id: 1,
            name: "Nguyễn Anh Phương"
        },
        responsible: [{
            _id: 2,
            name: "Phạm Đại Tài"
        },
        {
            _id: 3,
            name: "Nguyễn Văn Thắng"
        }],
        accountable: [{
            _id: 4,
            name: "TS.Trịnh Tuấn Đạt"
        }, {
            _id: 5,
            name: "TS. Vũ Thị Hương Giang"
        }],
        status: "Đúng tiến độ",
        description: "Lệnh sản xuất tuần thứ 41",
        createdAt: "10/10/2020",
        updatedAt: "20/10/2020"
    }, {
        _id: "2",
        code: "LSX002",
        manufacturingPlan: {
            _id: "1",
            code: "KH001"
        },
        startDate: "11/10/2020",
        endDate: "19/10/2020",
        startTurn: "2",
        endTurn: "3",
        good: {
            _id: "1",
            name: "tiffy",
        },
        quantity: 90,
        manufacturingMill: {
            _id: "1",
            code: "XSX001",
            name: "Nhà máy thuốc thú y"
        },
        creator: {
            _id: 1,
            name: "Nguyễn Anh Phương"
        },
        responsible: [{
            _id: 2,
            name: "Nguyễn Văn Tùng"
        },
        {
            _id: 3,
            name: "Nguyễn Văn Thắng"
        }],
        accountable: [{
            _id: 4,
            name: "TS.Trịnh Tuấn Đạt"
        }],
        status: "Đã hoàn thành",
        description: "Lệnh sản xuất tuần thứ 41",
        createdAt: "10/10/2020",
        updatedAt: "20/10/2020"
    }, {
        _id: "3",
        code: "LSX003",
        manufacturingPlan: {
            _id: "1",
            code: "KH001"
        },
        startDate: "11/10/2020",
        endDate: "19/10/2020",
        startTurn: "2",
        endTurn: "3",
        good: {
            _id: "1",
            name: "tiffy",
        },
        quantity: 90,
        manufacturingMill: {
            _id: "1",
            code: "XSX001",
            name: "Nhà máy thuốc thú y"
        },
        creator: {
            _id: 1,
            name: "Nguyễn Anh Phương"
        },
        responsible: [{
            _id: 2,
            name: "Nguyễn Văn Tùng"
        },
        {
            _id: 3,
            name: "Nguyễn Văn Thắng"
        }],
        accountable: [{
            _id: 4,
            name: "TS.Trịnh Tuấn Đạt"
        }],
        status: "Trễ tiến độ",
        description: "Lệnh sản xuất tuần thứ 41",
        createdAt: "10/10/2020",
        updatedAt: "20/10/2020"
    }]
}

export default sampleData;