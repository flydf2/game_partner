export const mockAppeals = [
  {
    id: 'SP202310240092',
    type: '违规言论/引战',
    status: 'processing',
    statusText: '处理中',
    statusClass: 'bg-primary-container/20 text-primary',
    target: {
      name: '夜火狂潮',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbFFFTOLXk3uh3QYfT5K_O_xwli3756CWmaRPqDURn9hQdMMVr69OFKFYEukdPgpij-8M4aF0yOB8_9gnq9msePksq2gNyksu7Hkg7P-D35FvPBA2Twqv76_3GXssW6kh69xJayXRj3FCsOiIYAaPAlkp5YLofI2Wslskx-FnkMhpF6MMJlsszgOF44PrEgT5KnzAF1JGKBQvsLyc-BpgyvqRjkfkJTD6-ugewCJITW4SZdjMZ_eNFAL71PG_4uVmFZoTbVoilpW0'
    },
    submitTime: '2023.10.24 14:20',
    content: '该用户在游戏过程中多次发表违规言论，引战斗嘴，影响游戏体验',
    evidence: [
      'https://example.com/evidence1.jpg',
      'https://example.com/evidence2.jpg'
    ],
    result: null
  },
  {
    id: 'SP202310220145',
    type: '消极比赛/挂机',
    status: 'completed',
    statusText: '已完成',
    statusClass: 'bg-emerald-100 text-emerald-700',
    target: {
      name: '小甜心软软',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh9xMrg68oicE9e-VAIhkrdgB1TkNcEtOcvR3FySiy-94rXsb84VQ4BrXjM2LNCCZbLlFep70TkMaAG8UPDOhjF2rolCEzNfjo2qxKZ5OVTvk9p0VjQooN9hnjHyviPZDE_C8I1mwk0p_3a7zwtRplZx3bi-LaJ5iSDXBeasRWzS7qap6X_QquQkk4wj3lYqsRWzKW_AMARsM0VMQxUylN0AGwq_3Bx5yVh7htFKk6AKYjs7hUVfnCLnXsj4Ftbf4HEdzH7_bHfCE'
    },
    submitTime: '2023.10.22 09:15',
    content: '该用户在匹配游戏中多次挂机不打，严重影响对局体验',
    evidence: [
      'https://example.com/evidence3.jpg'
    ],
    result: '已对该用户进行处罚，感谢您的反馈'
  },
  {
    id: 'SP202310210887',
    type: '代练嫌疑',
    status: 'pending',
    statusText: '待处理',
    statusClass: 'bg-neutral-200 text-neutral-500',
    target: {
      name: '野王带你飞',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgCfdtE87j_277mqHdGOrVB5ODdk3PB9qPrI4KHjwEwSoOCXY0PeDGmnjvQOV4amb7ApX9KpPnJdC_O441R5hJqPFtRFp53BwPBmmq_OdGBWQlxjL4KuGZcflFM3yGX98CoBIX2NP7o698CcpxL-c5ojRrLjgGZu-Nu3phfR801amAJqexlBDP66TlaB2FgQdLiURLe3N5rsHVf4WI86UXNKfO-rHzaRM2REmbRbUiHP737OFWo18X-rfw-c0iVZCVRILangWQY0A'
    },
    submitTime: '2023.10.21 21:00',
    content: '该用户疑似代练，使用多个账号接单，违反平台规则',
    evidence: [],
    result: null
  },
  {
    id: 'SP202310200563',
    type: '违规言论/引战',
    status: 'completed',
    statusText: '已完成',
    statusClass: 'bg-emerald-100 text-emerald-700',
    target: {
      name: '游戏小王子',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0dK_MZqKKAmyA4yP_BkKpGsS_W87iCSLeuAAmwt_w2J0Fv2TJ3nFinGP1J3GSQx67aimew8FhrXUj4yr1rs9GdeQQ0HoLz7PYrcmT-menQ1ggX6R3fg-gRg1AOiAechpMCNklo7nlzYm6oTif3LxCbdYzd3J-GAlZr6SEyxpjOmVPDUFE4dwfMogxpTTQg-RVyvcN33jdsEkwf8vjjX4NIE1tfsILkkmLj6dL8Mu-pfvMf__Z-Ik58KyaejQd1RAt3s-oj5nsyo8'
    },
    submitTime: '2023.10.20 15:30',
    content: '该用户在语音聊天中发表不当言论，影响恶劣',
    evidence: [
      'https://example.com/evidence4.jpg'
    ],
    result: '已对该用户进行警告处理'
  },
  {
    id: 'SP202310190234',
    type: '虚假宣传',
    status: 'pending',
    statusText: '待处理',
    statusClass: 'bg-neutral-200 text-neutral-500',
    target: {
      name: '电竞女神',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8XrMhk3VFwj3Ceer0yCVb-HelGKX5ryLoHAYthnekinYCfvHoJ83xSPEZdrL2tht2CTf_d1atj0kQiKVMY41s8kFOBgY2l5a9dPvoP6yXh3HyA9pdom7W1PkI1l7drYVsVSEeg-BnjsOK2tD_lvHVqzF3VZCAhg6pbcyZj11rhzX6V52RT4jlbNYqEKBRxP818vVewrnT3E6phVAdGXO9zQIWGaIvWWk6pXEzjpNwOh3xDn8FNjv-sGQOhsOt1srbfvB0MFCo-A'
    },
    submitTime: '2023.10.19 11:45',
    content: '该用户宣传虚假战绩，诱导用户充值',
    evidence: [],
    result: null
  }
]

export function mockGetAppeals(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredAppeals = [...mockAppeals]

      if (params.status) {
        filteredAppeals = filteredAppeals.filter(a => a.status === params.status)
      }

      if (params.type) {
        filteredAppeals = filteredAppeals.filter(a => a.type === params.type)
      }

      resolve({
        success: true,
        data: filteredAppeals
      })
    }, 300)
  })
}

export function mockCreateAppeal(appealData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '申诉提交成功',
        data: {
          id: `SP${Date.now()}`,
          ...appealData
        }
      })
    }, 500)
  })
}

export function mockGetAppealDetail(appealId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appeal = mockAppeals.find(a => a.id === appealId)
      if (appeal) {
        resolve({
          success: true,
          data: appeal
        })
      } else {
        resolve({
          success: false,
          message: '申诉记录不存在'
        })
      }
    }, 300)
  })
}
