const SECURITIES = [
  "大和ハウス工業",
  "積水ハウス",
  "日揮",
  "双日",
  "伊藤忠商事",
  "丸紅",
  "豊田通商",
  "三井物産",
  "住友商事",
  "三菱商事",
  "J",
  "三越伊勢丹ホールディングス",
  "セブン",
  "髙島屋",
  "丸井グループ",
  "イオン",
  "ファーストリテイリング",
  "コンコルディア・フィナンシャルグループ",
  "新生銀行",
  "あおぞら銀行",
  "三菱UFJフィナンシャル・グループ",
  "りそなホールディングス",
  "三井住友トラスト・ホールディングス",
  "三井住友フィナンシャルグループ",
  "千葉銀行",
  "ふくおかフィナンシャルグループ",
  "静岡銀行",
  "みずほフィナンシャルグループ",
  "大和証券グループ本社",
  "野村ホールディングス",
  "松井証券",
  "SOMPOホールディングス",
  "MS",
  "第一生命ホールディングス",
  "東京海上ホールディングス",
  "T",
  "クレディセゾン",
  "日本取引所グループ",
  "東急不動産ホールディングス",
  "三井不動産",
  "三菱地所",
  "東京建物",
  "住友不動産",
  "東武鉄道",
  "東急",
  "小田急電鉄",
  "京王電鉄",
  "京成電鉄",
  "東日本旅客鉄道",
  "西日本旅客鉄道",
  "東海旅客鉄道",
  "日本通運",
  "ヤマトホールディングス",
  "日本郵船",
  "商船三井",
  "川崎汽船",
  "ANAホールディングス",
  "三菱倉庫",
  "スカパーJSATホールディングス",
  "日本電信電話",
  "KDDI",
  "ソフトバンク",
  "NTTデータ",
  "ソフトバンクグループ",
  "東京電力ホールディングス",
  "中部電力",
  "関西電力",
  "東京ガス",
  "大阪ガス",
  "エムスリー",
  "ディー・エヌ・エー",
  "ネクソン",
  "電通グループ",
  "Zホールディングス",
  "トレンドマイクロ",
  "サイバーエージェント",
  "楽天",
  "リクルートホールディングス",
  "日本郵政",
  "東宝",
  "セコム",
  "コナミホールディングス",
];

const CLIENTS = [
  "A社",
  "B社",
  "C社",
  "D社",
  "E社",
  "F社",
  "G社",
];

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const generateData = (qty) =>
  Array.from({ length: getRandomInt(qty) }).map(() => ({
    トレーダー: randomItem(CLIENTS),
    証券: randomItem(SECURITIES),
    時間: new Date(),
    変更: Math.random() * 20 - 10,
    入札: Math.random() * 10 + 80,
    希望: Math.random() * 10 + 50,
    取引量: Math.random() * 10 + 70,
  }));
