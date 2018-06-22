class QuestItem {
  constructor(qid, name, type) {
    this.data = {}
    this.data['qid'] = qid;
    this.data['name'] = name;
    this.data['type'] = type;
    this.data['desc'] = "";
    this.data['subItems'] = [];
  }
  setDesc(desc) {
    this.data['desc'] = desc;
    return this;
  }
  addSub(i, o, d) {
    this.data['subItems'].push({
      oid: i,
      option: o,
      desc: d
    });
    return this;
  }
  addTip(tip) {
    this.data['tip'] = tip;
    return this;
  }
  getItem() {
    return this.data;
  }
}

/* defining questionnaire items */
let qGLplurality = new QuestItem('general_plurality', '복수성', 'one');
qGLplurality.setDesc('기사 속에 하나의 시각화가 있는지, 아니면 여러개의 시각화가 있는지 여부')
  .addSub('multiple', '복수', '전체 기사에 시각화가 한 개인 경우')
  .addSub('single', '복수', '전체 기사에 시각화가 한 개인 경우')
  .addTip('');
let qGL = new QuestItem('general_plurality', '복수성', 'one');
qGLplurality.setDesc('기사 속에 하나의 시각화가 있는지, 아니면 여러개의 시각화가 있는지 여부')
  .addSub('multiple', '복수', '전체 기사에 시각화가 한 개인 경우')
  .addSub('single', '복수', '전체 기사에 시각화가 한 개인 경우');


/*making general output*/
const questionnaire_format = {
  general: [
    
    ],
  sub: [
    ]
}

class Questionnaire {
  constructor(n) {
    this.subvis = n;
  }
  getQuestionnaire() {
    let result = {};
    return {};
  }
}

module.exports = Questionnaire;