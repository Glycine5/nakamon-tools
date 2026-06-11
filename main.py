from kivymd.app import MDApp
from kivy.uix.spinner import Spinner
from kivy.uix.stacklayout import StackLayout
from kivy.uix.boxlayout import BoxLayout
from kivy.core.text import LabelBase, DEFAULT_FONT
from kivy.resources import resource_add_path
from kivy.uix.checkbox import CheckBox
#from kivymd.uix.dialog import MDDialog
#from kivymd.uix.menu import MDDropdownMenu
from kivy.uix.popup import Popup
from kivy.lang import Builder

#import japanize_kivy # 日本語表示
from kivy.core.text import LabelBase, DEFAULT_FONT
from kivy.resources import resource_add_path
from kivy.utils import platform
import status
import data

resource_add_path("C:/Windows/Fonts")
LabelBase.register(DEFAULT_FONT, "meiryob.ttc")

#font_path = os.path.join(os.path.dirname(__file__), "font", "NotoSansJP-Medium.ttf")
#resource_add_path(os.path.dirname(font_path))
#LabelBase.register(DEFAULT_FONT, font_path)
#resource_add_path("./")
#LabelBase.register(DEFAULT_FONT, "NotoSansJP-Medium.ttf")


from kivy.uix.widget import Widget
from kivy.core.window import Window
Window.size = (400, 650)

#ウインドウの幅と高さの設定
#onfig.set('graphics', 'width', 700)
#onfig.set('graphics', 'height', 1600)
#1でサイズ変更可、0はサイズ変更不可
#onfig.set('graphics', 'resizable', 1)

###モンスター基本ステ####
#0H,1M,2力,3守,4魔,5回,6す,7き,8敵味方変数0味方1敵, 9名前, 10無属性
#属性弱点耐性 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル
#19回復行動用の1(性格補正で0.8や0.3などへ)
#20眠,21マ,22混,23幻,24毒,25死,26呪,27休,28封,29魅,30攻↓,31守↓,32早↓,33呪耐↓
#34系統: 0けもの 1ドラゴン 2物質 3エレメント 4ゾンビ 5水 6悪魔 7植物 8スライム 9鳥 10？？？ 11マシン 12虫 13怪人
#########################
#################スキルパラメータ########################################
#呪文パラメーター ([0-3]倍率、[4]単or全体、[5]呪文ブレス1、[6]属性, [7]消費MP)
#[4]3単体回復, 4全体回復, 5ザオ, 6ザオラル
#属性[6](10無 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル,19全体回復)
#ブレスパラメーター ([0-3]倍率、[4]単or全体、[5]呪文ブレス2)
#物理スキルパラメーター([0]倍率、[4]]単体、[5]大暴れ型5,物理単発6,1.6~2.0型7)
#物理スキルパラメーター([0]倍率、[4]全体、[5]大暴れ型5,1.6~2.0型7)
######################################################################################

class CustomSpinner(Spinner):
    pass

class Generate_Monster:

    @staticmethod
    def seikaku_selection(text):
        seikaku_hosei_mapping = {
            'ぬけめがない': (1, 1, 1, 1, 1, 1, 1, 1, 0.5),
            'おせっかい': (0.95, 1.05, 0.98, 1.03, 0.93, 1.08, 1, 1, 0.8),
            'ずのうめいせき': (0.97, 1.08, 0.93, 0.95, 1.05, 1.05, 0.95, 1.05, 0.7),
            'きれもの': (0.97, 1.05, 0.95, 0.95, 1.08, 0.93, 1.05, 1.05, 0.5),
            'ちからじまん': (1.03, 0.93, 1.06, 1.03, 0.95, 0.95, 0.93, 0.93, 0.3),
            'いっぴきおおかみ': (1.05, 0.98, 1.03, 0.95, 1.05, 0.93, 1.05, 0.95, 0.3),
            'むっつりすけべ': (1.03, 0.95, 0.97, 1.02, 0.97, 0.97, 1.08, 1.05, 0.3),
            'おおぐらい': (1.01, 0.93, 1.02, 1.05, 0.93, 0.93, 0.92, 1, 0.2),
            '性格': (1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        }
        return seikaku_hosei_mapping.get(text, (1, 1, 1, 1, 1, 1, 1, 1, 0.5))

    @staticmethod
    def sositu_selection(text):
        """素質選択に応じた補正値を返す静的メソッド"""
        mapping = {
            '極': 1,
            '超': 0.92,
            '特': 0.85,
            '優': 0.8,
            '並': 0.75,
            '素質': 1
        }
        return mapping.get(text, 1)  # デフォルトは1（素質の場合）
    @staticmethod
    def monster_selection(text):
        monster_dict = {
            'オルゴデミーラ': status.orgodemira,
            'メイデンドール49': status.meiden_doll_49,
            'メイデンドール': status.meiden_doll,
            'ヘルバオム': status.hellbaum,
            'ダッシュラン': status.dash_run,
            'コロネホワイト': status.col_white,
            'スライムコロネ': status.slime_col,
            'キラーマシン': status.killer_machine,
            'やかんのまじん': status.yakannomajin,
            'ハーゴン':status.hagon,
            'オーシャン':status.ocean_bone,
            'ジュリアンテ':status.juriante,
            'ハーゴンきし':status.hagon_kisi,
            'スライムタワ':status.slime_tow,
            'アルミラージ':status.alumiraj,
            'わかめおうじ':status.wakame,
            'うごくせきぞう':status.sekizou,
            'ガーゴイル':status.gargo,
            'マッドフィンガー':status.mad_fin,
            'バブルスライム':status.babble_slime,
            'おおがらす':status.oogarasu,
            'ネルゲル':status.nelgel,
            'グレイナル': status.graynal,
            'デスタムーア': status.destamua,
            'スライムジェネ': status.slime_general,
            'ジャミラス': status.jamirasu,
            'バトルレックス': status.batore,
            'ブラティーポ': status.buratipo,
            'テンツク': status.tentuku,
            'ファーラット': status.farrat,
            'ぶちスライム': status.butisura,
            'まおうのつかい': status.maotuka,
            'バルボロス': status.balboros,
            'テンタクルス': status.tentak,
            'きとうし': status.kitousi,
            'デビルアーマ': status.devil_armer,
            'リリパット': status.lilipat,  
            'リカント': status.ricant,   
            'おばけきのこ': status.obake_kinoko,             
            'シルバーデビル': status.sildev,
            'よろいのきし': status.yorokisi,
            'シャドー': status.shadow,
            'どろにんぎょう': status.doronin,
            'ももんじゃ': status.momonja,
            'ヘルバトラー': status.hell_battler,
            'ホークブリザード': status.hokuburi,
            'ホークブリザード49': status.hokuburi_49,
            'りゅうおう': status.ryuou,
            'デスピサロ': status.dethpisaro,
            'ギガンテス': status.gigantes,
            'アームライオン': status.armla,
            'ヘルクラウダー': status.helcloud,
            'キングスライム': status.kingu,
            'ボーンナイト': status.bonnai,
            'スカイドラゴン': status.sky,
            'シャドーサタン': status.sha,
            'グレイトマーマン': status.great_merman,
            'ゴーレム': status.gohrem,
            'ワイトキング': status.waito,
            'キラーパンサー': status.kip,
            'てんどうしし': status.ten,
            'ドラゴスライム': status.drg,
            'ひとつめピエロ': status.hitotume,
            'スライムナイト': status.sln,
            'ほのおのせんし': status.hon,
            'ドラゴン': status.dra,
            'トロル': status.tro,
            'だいまどう': status.dai,
            'シールドオーガ': status.sir,
            'シールドオーガ49': status.sir_49,
            'カメレオンマン': status.kam,
            'キメラ': status.kim,
            'ホークマン': status.hom,
            'さまようよろい': status.sam,
            'ヘルコンドル': status.helkon,
            'とらおとこ': status.toraotoko,
            'スカルゴン49': status.skull_49,
            'スカルゴン': status.skull,
            'ガニラス': status.ganira,
            'ブリザード': status.bur,
            'ミイラ男': status.mii,
            'リザードマン': status.riz,
            'デンデン竜': status.den,
            'ガチャコッコ': status.gat,
            'ミニデーモン': status.mid,
            'ドルイド': status.dor,
            'ごろつき': status.gor,
            'ヘルボックル': status.heb,
            'マリンスライム': status.mar,
            'マリンスライム49': status.mar_49,
            'メーダ': status.med,
            'てつのさそり': status.tet,
            'ひとくいばこ': status.hit,
            'わらいぶくろ': status.war,
            'デッドペッカー': status.deadp,
            'ねこまどう': status.nekoma,
            'ビッグハット': status.bigha,
            'ベビーパンサー': status.beb,
            'プリズニャン': status.pri,
            'スライム': status.sli,
            'ホイミスライム': status.hoi,
            'メラゴースト': status.mer,
            'ゴースト': status.goh,
            'くさったしたい': status.kus,
            'ドラゴンキッズ': status.drk,
            'メタッピー': status.met,
            'からくり兵': status.kar,
            'グレムリン': status.gre,
            'モーモン': status.mom,
            'ブラウニー': status.bra,
            'びっくりサタン': status.bikkuri,
            'ナスビナーラ': status.nasubi,
            'オニオーン': status.oni,
            'じんめんじゅ': status.jin,
            'ポイズンリザード': status.poi,
            'だいおうキッズ': status.dai,
            'キャタピラー': status.kya,
            'ドラキー': status.dri,
            'ばくだんいわ': status.bak,
            'ひとくいサーベル': status.his,
            'あくまのツボ': status.akumano,
            'おにこぞう': status.oniko,
            'ズッキーニャ': status.zukki,
            'おばけキャンドル': status.obake,
            '攻撃モンスター': status.default_m,
            '守備モンスター': status.default_m,
            '左or味方モンスター': status.default_m,
            '右or敵モンスター': status.default_m,
        }
        
        # 該当するモンスターが見つからなければNoneを返す
        return monster_dict.get(text, None)

    @staticmethod
    def buturi_zen_selection(text, basic_status_2):
        skill_dict = {
            'サイクロン': data.syakunetusaikuron,
            '死神の一撃': data.sinigaminoitigeki,
            'セイント': data.seintoinpakuto,
            'メイルスト': data.meirusutoromu,
            'ヒートイン': data.heatinf,
            'ランドイン': data.landimpact,
            'キングプレ': data.kingupuresu,
            'フローズン': data.frozen_w,
            '閃烈回転': data.senretukaitengiri,
            '氷岩おとし': data.hyouganotosi,
            'プラズマウ': data.purazumauebu,
            'リーフスラ': data.rihusurasyu,
            '岩石おとし': data.gansekiotosi,
            '光爆なぎ': data.koubakunagiharai,
            '灼熱なぎ': data.syakunetunagiharai,
            'キングダム': data.kingudamusodo,
            'ぶんまわし': data.bunmawasi,
            'いなずま': data.inazuma,
            'しんくうは': data.sinkuuha,
            'アーススイ': data.asusuingu,
            'シャインス': data.syainsukoru,
            'ナイトメア': data.naitomeasodo,
            '火炎裂空脚': data.kaenrekuukyaku,
            'でんげき': data.dengeki,
            '回転たたき': data.kaitentataki,
            'はげしいお': data.hagesiiotakebi,
            'バイタルイ': data.bital_impact,
            '全体物理': data.none
        }

        if text == 'メイルスト' and basic_status_2[34] == 5:  # 水系[34]==5
            return data.meirusutoromumizu, 'メイル水'
        elif text == '火炎裂空脚' and basic_status_2[34] == 9:  # 鳥系[34]==9
            return data.kaenrekuukyakutori, '火炎裂 鳥'
        else:
            return skill_dict.get(text, None), text

    @staticmethod
    def buturi_tan_selection(text, basic_status_2):
        skill_dict = {
            'クリムゾン': data.kurimuzon,
            'ゴッドスマ': data.godosumasyu,
            'ギガソード': data.gigaso,
            'テンペスト': data.tenpest,
            'テンペx1': data.tenpest_ichi,
            'デスクロー': data.dethcrow,
            'デスクx1': data.dethcrow_ichi,
            '冥王の炎鎌': data.meiounoengama,
            '冥王(直撃)': data.meiounoengama,
            '氷結らんげ': data.hyouketu,
            '氷結x1': data.hyouketu_ichi,
            'アイスブラ': data.ice_blast,
            'はげ斬り': data.hagekiri,
            'はげ斬x1': data.hagekiri_ichi,
            'アースブレ': data.asubureiku,
            'ヒートスラ': data.hitosuraisa,
            '大地の一撃': data.daitinoitigeki,
            '魔瘴弾': data.masyoudan,
            '漆黒の爪': data.sikkoku,
            '漆黒x1': data.sikkoku_ichi,
            'タイガーク': data.taigakuro,
            'タイガx1': data.taigakuro_ichi,
            'レボルスラ': data.reborusuraisa,
            'タックル': data.takuru,
            'シールドブ': data.sirudobureiku,
            'ヒールファ': data.hirufangu,
            '大暴れx1': data.ooabare,
            '雷光x1': data.raikou,
            '鳴動x1': data.meidou,
            'さみだれx1': data.samidare,
            'せいけんづ': data.seikenzuki,
            'しんくう斬': data.sinkugiri,
            'Wアタック': data.w_atack,
            'Wアタx1': data.w_atack_ichi,
            '裂鋼拳': data.rekouken,
            '裂鋼x1': data.rekouken_ichi,
            'ドラゴン斬': data.doragongiri,
            '黄泉送り': data.yomiokuri,
            'やいばくだ': data.yaibakudaki,
            'たいあたり': data.taiatari,
            'かぶとわり': data.kabutowari,
            'かえん斬り': data.kaengiri,
            'マヒャド斬': data.mahyadogiri,
            'いなずま斬': data.inazumagiri,
            'たいぼく斬': data.taibokuzan,
            'かまいたち': data.kamaitati,
            'けものづき': data.kemonozuki,
            'シールドア': data.sirudoataku,
            'マヒ攻撃': data.mahikougeki,
            'もうどく攻': data.moudokukougeki,
            'のろい攻撃': data.noroikougeki,
            'ねむり攻撃': data.nemurikougeki,
            '混乱攻撃': data.konrankougeki,
            'あしばらい': data.asibarai,
            'ハッスルブ': data.hastle_break,
            '通常攻撃': data.none,
            '単体物理': data.none,
        }
        
        special_cases = {
            '裂鋼拳': (11, data.rekoukenmasin),
            '裂鋼x1': (11, data.rekoukenmasin_ichi),
            'ドラゴン斬': (1, data.doragongirisoragon),
            '黄泉送り': (4, data.yomiokurizonbi),
            'たいぼく斬': (7, data.taibokuzansyokubutu),
            'かまいたち': (3, data.kamaitatieremento),
            'けものづき': (0, data.kemonozukikemono),
        }

        if text in special_cases:
            required_status, skill = special_cases[text]
            if basic_status_2[34] == required_status:
                return skill, f'{text} 特化'

        # 該当するスキルが辞書にある場合
        return skill_dict.get(text, data.none), text
    
    @staticmethod
    def jumon_selection(text):
        skill_dict = {
            'ギガデイン': data.gigadein,
            'ベギラゴン': data.begiragon,
            'マヒャド': data.mahyado,
            'イオナズン': data.ionazun,
            '黒の魔砲': data.kuronomahou,
            'グランテン':data.grandtenp,
            '大地の報い': data.daitinomukui,
            'ざざん波': data.zazanpa,
            'ベギラ強': data.begituyo,
            'ヒャダル強': data.hyadatuyo,
            'バギクロス': data.bagikuro,
            'ベギラマ': data.begirama,
            'バギマ': data.bagima,
            'ヒャダルコ': data.hyadaruko,
            'イオラ': data.iora,
            'ジバリーナ': data.zibarina,
            'こうねつの': data.kounetunogasu,
            'かがやく息': data.kagayakuiki,
            'ひかりのほ': data.hikarino,
            'プラズマ': data.plazma,
            '激しい炎': data.hagehono,
            '凍える吹雪': data.hubuki,
            '光のブレス': data.hikabure,
            '闇のブレス': data.yamibure,
            'サンドスト': data.sandosutomu,
            '火の息': data.hinoiki,
            '火炎の息': data.kaennnoiki,
            '氷の息': data.koorinoiki,
            'たつまき': data.tatumaki,
            'サンドブレ': data.sandoburesu,
            'ベホマラー': data.behomara,
            'ウェーブ': data.iyasinouebu,
            'いやしかぜ': data.iyasinokaze,
            '全・呪ブ': data.none,
        }

        # 該当する呪文が辞書にある場合
        skill = skill_dict.get(text)
        if skill is not None:
            return skill
        else:
            return [0]*7  # エラーを避けるためにデフォルトのリストを返す
        
    @staticmethod
    def breath_selection(text):
        skill_dict = {
            '火球バズー': data.kakyuu,
            '氷塊バズー': data.hyoukai,
            '暴風バズー': data.bouhuu,
            '雷光バズー': data.raikobaz,
            'いかずち': data.ikazuti,
            'イオマータ': data.iomata,
            'イオマタx1': data.iomata_1,
            '蒼玉の水撃': data.suigeki,
            'ドルモーア': data.dorumoa,
            'メラゾーマ': data.merazoma,
            '閃熱の魔弾': data.sennetu,
            'ドルクマ強': data.dorutuyo,
            'ライデイン': data.raidein,
            'ソルフレア': data.soruhurea,
            'ドルクマ': data.dorukuma,
            'メラミ': data.merami,
            'デイン': data.dein,
            'ドルマ': data.doruma,
            'ジバリカ': data.zibarika,
            'メラ': data.mera,
            'ヒャド': data.hyado,
            'ベホイミ': data.behoimi,
            'ホイミ': data.hoimi,
            'ヒルファ回': data.hirufangukai,
            'ハッスル回': data.hastle_break_kai,
            '単・呪ブ': data.none,
        }

        # 該当するスキルが辞書にある場合
        return skill_dict.get(text, None)


class CalcDamage:
    
    @staticmethod
    def calc_damage_phys(power,
                         kougeki_hosei,
                         baiki_hosei,
                         guard,
                         syubi_hosei,
                         skala_hosei,
                         skill_mag,resist,
                         zokusei_tai_hosei,
                         zantaitai_hosei,
                         keitou_tai_hosei,
                         zokusei_hosei,
                         zokuzen_hosei,
                         keitou_hosei,
                         additional_mag,
                         kouryu_mag
                         ):
        import math
        basic_damage = math.floor(max(0, (power)/2 - ((guard+syubi_hosei)*(1+0.2*skala_hosei)/4)))
        damage = basic_damage*skill_mag*additional_mag*kouryu_mag*(resist-zokusei_tai_hosei/100)*(1-zantaitai_hosei/100)*(1-keitou_tai_hosei/100)*(1+ math.floor(zokusei_hosei+zokuzen_hosei)/100)*(1+keitou_hosei/100)
        damage = math.floor(damage)
        damage_center=damage
        max_damage = math.floor((basic_damage+math.floor((basic_damage/16)+1))*skill_mag*additional_mag*kouryu_mag*(resist-zokusei_tai_hosei/100)*(1-zantaitai_hosei/100)*(1-keitou_tai_hosei/100)*(1+ math.floor(zokusei_hosei+zokuzen_hosei)/100)*(1+keitou_hosei/100))
        max_damage = math.floor(max_damage)
        mini_damage = math.floor((basic_damage-math.floor((basic_damage/16)+1))*skill_mag*additional_mag*kouryu_mag*(resist-zokusei_tai_hosei/100)*(1-zantaitai_hosei/100)*(1-keitou_tai_hosei/100)*(1+ math.floor(zokusei_hosei+zokuzen_hosei)/100)*(1+keitou_hosei/100))
        mini_damage = math.floor(mini_damage)
        return (basic_damage, damage, damage_center, max_damage, mini_damage)
    

    @staticmethod
    def damage_jumon(mini_power_int,
                     m_power_int,
                     kouma_hosei,
                     mini_mpower_int,
                     max_power_int,
                     max_mpower_int,
                     resist_jumon,
                     zokusei_tai_hosei,
                     additional_mag_jumon,
                     zokusei_hosei,
                     zokuzen_hosei,
                     keitou_hosei,
                     skeitou_tai_hosei,
                     jumontai_hosei,
                     keitou_tai_hosei,
                     kouryu_mag,
                     is_healing=False
                     ):
        basic_damage_m =(
            mini_power_int+(
                m_power_int+kouma_hosei - mini_mpower_int
                )*(
                max_power_int - mini_power_int
                )/(
                max_mpower_int - mini_mpower_int
                )
                )
        import math
        basic_damage_m =math.floor(basic_damage_m)
        if is_healing:
            zokusei_factor = (1+zokusei_hosei/100)*(1+zokuzen_hosei/100)
        else:
            zokusei_factor = (1+zokusei_hosei/100+zokuzen_hosei/100)

        damage_jumon = basic_damage_m*(
            resist_jumon-zokusei_tai_hosei/100
            )*additional_mag_jumon*kouryu_mag*zokusei_factor*(
            1+keitou_hosei/100
            )*(
            1-skeitou_tai_hosei/100
            )*(
            1-jumontai_hosei/100
            )

        damage_jumon = math.floor(damage_jumon)
        max_basic_damage_m = basic_damage_m+math.floor(0.06*basic_damage_m)
        mini_basic_damage_m =  basic_damage_m-math.floor(0.06*basic_damage_m)
        max_damage_jumon = max_basic_damage_m*(resist_jumon-zokusei_tai_hosei/100)*additional_mag_jumon*kouryu_mag*zokusei_factor*(1+keitou_hosei/100)*(1-keitou_tai_hosei/100)*(1-jumontai_hosei/100)
        max_damage_jumon =  math.floor(max_damage_jumon)
        mini_damage_jumon = mini_basic_damage_m*(resist_jumon-zokusei_tai_hosei/100)*additional_mag_jumon*kouryu_mag*zokusei_factor*(1+keitou_hosei/100)*(1-keitou_tai_hosei/100)*(1-jumontai_hosei/100)
        mini_damage_jumon =  math.floor(mini_damage_jumon)
        return (basic_damage_m, damage_jumon, max_basic_damage_m, mini_basic_damage_m, max_damage_jumon, mini_damage_jumon)


class RootWidget(StackLayout):

    def __init__(self, **kwargs):
        super(RootWidget, self).__init__(**kwargs)


#######################################################################################
#########################ダメダス##################################################
class DamedasuTab(StackLayout):
    def __init__(self, root_widget=None, **kwargs):
        super(DamedasuTab, self).__init__(**kwargs)
        self.bind(on_kv_post=self._on_kv_post)

    def _on_kv_post(self, base_widget, root_widget):
    #モンスター選択
        self.ids.monster.values= data.monster_lst
        self.ids.monster_2.values= data.monster_lst
    #物理スキル選択
        self.ids.buturi_tan.values= data.skill_tan_lst
        self.ids.buturi_zen.values= data.skill_zen_lst
    #呪文ブレススキル選択
        self.ids.jumon.values= data.jumon_zen_lst
        self.ids.breath.values= data.jumon_tan_lst

#ダメージ関数（全体物理）
    ########補正初期化#########
    def monster_define(self):

        if self.ids.monster.text=='攻撃モンスター':
            self.basic_status=status.default_m
            power =self.basic_status[2]
            m_power=self.basic_status[4]
        else:
            power =self.sosituseikaku_monster[2]
            m_power =self.sosituseikaku_monster[4]
        if self.ids.monster_2.text=='守備モンスター':
            self.basic_status_2=status.default_m
            guard =self.basic_status_2[3]

        else:
            guard =self.sosituseikaku_monster_2[3]

        if self.ids.buturi_tan.text=='単体物理':
            self.skill_buturi_tan=data.none
            skill_mag_tan=self.skill_buturi_tan[0]
        else:
            skill_mag_tan=self.skill_buturi_tan[0]

        if self.ids.buturi_zen.text=='全体物理':
            self.skill_buturi_zen=data.none
            skill_mag=self.skill_buturi_zen[0]
        else:
            skill_mag=self.skill_buturi_zen[0]

        return power,m_power,guard,skill_mag_tan,skill_mag

    def hosei_syokika(self):
        ids_to_attrs = {
            'zokusei': 'zokusei_hosei',
            'zokuzen': 'zokuzen_hosei',
            'keitou': 'keitou_hosei',
            'kougeki': 'kougeki_hosei',
            'baiki': 'baiki_hosei',
            'zokusei_tai': 'zokusei_tai_hosei',
            'keitou_tai': 'keitou_tai_hosei',
            'syubi': 'syubi_hosei',
            'zantaitai': 'zantaitai_hosei',
            'jumontai': 'jumontai_hosei',
            'bretai': 'bretai_hosei',
            'skala': 'skala_hosei',
            'kouma': 'kouma_hosei',
            'kiyousa': 'kiyousa_hosei',
        }

        for key, attr in ids_to_attrs.items():
            if self.ids[key].text == '0':
                setattr(self, attr, 0)
        
        return tuple(getattr(self, attr) for attr in ids_to_attrs.values())
    

#############↑↑↑↑ここまで共通##################


    def damage_phys_zen(self):

        power,m_power,guard,skill_mag_tan,skill_mag=self.monster_define()
        (self.zokusei_hosei,
                self.zokuzen_hosei,
                self.keitou_hosei,
                self.kougeki_hosei,
                self.baiki_hosei,
                self.zokusei_tai_hosei,
                self.keitou_tai_hosei,
                self.syubi_hosei,
                self.zantaitai_hosei,
                self.jumontai_hosei,
                self.bretai_hosei,
                self.skala_hosei,
                self.kouma_hosei,
                self.kiyousa_hosei)=self.hosei_syokika()

    ########初期値#########
    
    # 属性名の辞書
        zokusei_names = {
            10: "無属性", 11: "メラ", 12: "ギラ", 13: "イオ", 
            14: "ヒャド", 15: "バギ", 16: "ジバ", 17: "デイン", 18: "ドルマ",
            37: "ザバ"
        }

        # ドルマ属性の特別処理
        if self.ids.force.text == 'ドルマ' and self.skill_buturi_zen[6] == 10:  # 無属性=10
            zokusei_num = 18  # ドルマ=18
            self.zokusei_hosei_zen = self.zokusei_hosei / 2
            self.zokuzen_hosei_zen = self.zokuzen_hosei / 2
            self.ids.calced_status_101.text = "ドルフォ"
        else:
            zokusei_num = self.skill_buturi_zen[6]  # 選択された属性
            self.zokusei_hosei_zen = self.zokusei_hosei
            self.zokuzen_hosei_zen = self.zokuzen_hosei

            # 属性名の表示
            if self.ids.buturi_zen.text == '全体物理':
                self.ids.calced_status_101.text = "-"
            else:
                self.ids.calced_status_101.text = zokusei_names.get(self.skill_buturi_zen[6], "-")

        # 属性耐性
        resist = self.basic_status_2[zokusei_num]  # 属性耐性

        # 追加倍率の計算
        additional_mag = 1  # 予備
        if self.ids.force_2.text == 'ドルマ' and zokusei_num == 18:
            additional_mag = 0.8
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag = 1  # 
        if self.ids.kouryu.text == '+1':
            kouryu_mag = 1.2
        elif self.ids.kouryu.text == '+2':
            kouryu_mag = 1.4
        elif self.ids.kouryu.text == '+3':
            kouryu_mag = 1.6
        elif self.ids.kouryu.text == '+4':
            kouryu_mag = 1.8
        else:
            pass
        # 物理計算式
        if self.ids.bousou.active:  # 会心の一撃
            skill_mag = max(skill_mag, 1)

#########攻魔複合########################################
        ################
        ################################################
        import math

        if self.skill_buturi_zen[1]=='hukugou': #攻魔複合なら
            power =math.floor(0.85*((power+self.kougeki_hosei)*(1+0.2*self.baiki_hosei))) + math.floor(0.85*(m_power+self.kouma_hosei))
        elif self.skill_buturi_zen[1]=='koukai': #攻回複合なら
            kaima_value = status.default_m[5] if self.ids.monster.text == '攻撃モンスター' else self.sosituseikaku_monster[5]
            power =math.floor(0.50*((power+self.kougeki_hosei)*(1+0.2*self.baiki_hosei))) + math.floor(1.30*(kaima_value + self.kouma_hosei))
        else:
            power=(power+self.kougeki_hosei)*(1+0.2*self.baiki_hosei)
            m_power=m_power+self.kouma_hosei 
     

        __,damage,damage_center,max_damage_zen,mini_damage_zen=CalcDamage.calc_damage_phys(
            power,self.kougeki_hosei,
            self.baiki_hosei,guard,
            self.syubi_hosei,
            self.skala_hosei,
            skill_mag,resist,
            self.zokusei_tai_hosei,
            self.zantaitai_hosei,
            self.keitou_tai_hosei,
            self.zokusei_hosei,
            self.zokuzen_hosei,
            self.keitou_hosei,
            additional_mag,
            kouryu_mag
            )

        import math

        def calculate_damage(damage, multiplier):
            return math.floor(multiplier * damage)
        
#########要チェック#############
####################################################################
        def set_calced_status(damage_value, power, guard, kougeki_hosei, syubi_hosei, baiki_hosei, skala_hosei, id_name):
            if self.ids.monster.text == '攻撃モンスター' or self.ids.monster_2.text == '守備モンスター' or self.ids.buturi_zen.text == '全体物理':
                self.ids[id_name].text = str('-')
            elif damage_value <= 0 and (((power)) / ((guard + syubi_hosei) * (1 + 0.2 * skala_hosei))) >= 4/7:
                self.ids.calced_status_30.text = str('無効')
            elif ((power)) / ((guard + syubi_hosei) * (1 + 0.2 * skala_hosei)) < 4/7:
                self.ids[id_name].text = str('4/7')
            elif ((power)) / ((guard + syubi_hosei) * (1 + 0.2 * skala_hosei)) < 1/2:
                self.ids[id_name].text = str('1/2')
            else:
                self.ids[id_name].text = str(damage_value)

        if self.ids.bousou.active:
            damage_center = calculate_damage(damage, 1.8)
            max_damage_zen = calculate_damage(max_damage_zen, 2) #test
            mini_damage_zen = calculate_damage(mini_damage_zen, 1.6) #test

        # センターのダメージ計算
        set_calced_status(damage_center, power, guard, self.kougeki_hosei, self.syubi_hosei, self.baiki_hosei, self.skala_hosei, 'calced_status_28')

        # 最小ダメージ計算
        set_calced_status(mini_damage_zen, power, guard, self.kougeki_hosei, self.syubi_hosei, self.baiki_hosei, self.skala_hosei, 'calced_status_26')

        # 最大ダメージ計算
        set_calced_status(max_damage_zen, power, guard, self.kougeki_hosei, self.syubi_hosei, self.baiki_hosei, self.skala_hosei, 'calced_status_30')


############残りHP##################
        if self.ids.remHP.active and (self.ids.monster.text != '攻撃モンスター') and (self.ids.monster_2.text != '守備モンスター') and (self.ids.buturi_zen.text != '全体物理'):
            self.ids.calced_status_28.text=str(self.sosituseikaku_monster_2[0]-damage_center)
            self.ids.calced_status_26.text=str(self.sosituseikaku_monster_2[0]-mini_damage_zen)
            self.ids.calced_status_30.text=str(self.sosituseikaku_monster_2[0]-max_damage_zen)

###########################################



#ダメージ関数（単体物理）
    def damage_phys_tan(self):
    ########補正初期化#########
        power,m_power,guard,skill_mag_tan,skill_mag=self.monster_define()
        (self.zokusei_hosei,
        self.zokuzen_hosei,
        self.keitou_hosei,
        self.kougeki_hosei,
        self.baiki_hosei,
        self.zokusei_tai_hosei,
        self.keitou_tai_hosei,
        self.syubi_hosei,
        self.zantaitai_hosei,
        self.jumontai_hosei,
        self.bretai_hosei,
        self.skala_hosei,
        self.kouma_hosei,
        self.kiyousa_hosei)=self.hosei_syokika()
        ##冥王(直撃)
        if self.ids.buturi_tan.text=='冥王(直撃)':
            guard = 0
            self.syubi_hosei=0
        # 属性名と番号のマッピングを定義
        attribute_map = {
            10: "無属性",
            11: "メラ",
            12: "ギラ",
            13: "イオ",
            14: "ヒャド",
            15: "バギ",
            16: "ジバ",
            17: "デイン",
            18: "ドルマ",
            7: "ザバ"
        }

        # 属性番号とテキストを設定
        if self.ids.force.text == 'ドルマ' and self.skill_buturi_tan[6] == 10:  # 無属性=10
            zokusei_num_tan = 18  # ドルマ=18
            self.zokusei_hosei_tan = self.zokusei_hosei / 2
            self.zokuzen_hosei_tan = self.zokuzen_hosei / 2
            self.ids.calced_status_102.text = "ドルフォ"
        else:
            zokusei_num_tan = self.skill_buturi_tan[6]  # 選択全体属性
            self.zokusei_hosei_tan = self.zokusei_hosei
            self.zokuzen_hosei_tan = self.zokuzen_hosei
            
            # 属性テキストを設定
            if self.ids.buturi_tan.text == '単体物理':
                self.ids.calced_status_102.text = "-"
            else:
                self.ids.calced_status_102.text = attribute_map.get(self.skill_buturi_tan[6], "不明")

        # 属性耐性を取得
        resist_tan = self.basic_status_2[zokusei_num_tan]


 ########


        additional_mag_tan=1
        if self.ids.force_2.text=='ドルマ' and zokusei_num_tan==18:
            additional_mag_tan=0.8
        else:
            pass
        ###光竜　単体物理
        kouryu_mag = 1  # 
        if self.ids.kouryu.text == '+1':
            kouryu_mag = 1.2
        elif self.ids.kouryu.text == '+2':
            kouryu_mag = 1.4
        elif self.ids.kouryu.text == '+3':
            kouryu_mag = 1.6
        elif self.ids.kouryu.text == '+4':
            kouryu_mag = 1.8
        else:
            pass
        if self.ids.bousou.active:
            if self.skill_buturi_tan[5]==5:#会心スキル（大暴れ）
                skill_mag_tan=1
            else:
                pass

#########攻魔複合#(工事中)#######################################
        ################
        ################################################
        import math

        if self.skill_buturi_tan[1]=='hukugou': #攻魔複合なら
            power =math.floor(0.85*((power+self.kougeki_hosei))*(1+0.2*self.baiki_hosei)) + math.floor(0.85*(m_power+self.kouma_hosei))
        elif self.skill_buturi_tan[1]=='koukai': #攻回複合なら
            kaima_value = status.default_m[5] if self.ids.monster.text == '攻撃モンスター' else self.sosituseikaku_monster[5]
            power =math.floor(0.50*((power+self.kougeki_hosei)*(1+0.2*self.baiki_hosei))) + math.floor(1.30*(kaima_value + self.kouma_hosei))
        else:
            power=(power+self.kougeki_hosei)*(1+0.2*self.baiki_hosei)
            m_power=m_power+self.kouma_hosei  

        __,damage_tan,damage_center_tan,max_damage_tan,mini_damage_tan=CalcDamage.calc_damage_phys(
            power,self.kougeki_hosei,
            self.baiki_hosei,guard,
            self.syubi_hosei,
            self.skala_hosei,
            skill_mag_tan,resist_tan,
            self.zokusei_tai_hosei,
            self.zantaitai_hosei,
            self.keitou_tai_hosei,
            self.zokusei_hosei,
            self.zokuzen_hosei,
            self.keitou_hosei,
            additional_mag_tan,
            kouryu_mag
            )


        import math
        #[5]大暴れ型5,物理単発6,1.6~2.0型7)
        if self.ids.bousou.active:        
            if self.skill_buturi_tan[5]==5:#会心スキル（大暴れ）
                damage_center_tan = math.floor(1.8*damage_tan)
                max_damage_tan = math.floor(2*max_damage_tan) #test
                mini_damage_tan = math.floor(1.6*mini_damage_tan) # test
            elif self.skill_buturi_tan[5]==7:#会心スキル（デスクロー）
                damage_center_tan = math.floor(1.8*damage_tan)
                max_damage_tan = math.floor(2*max_damage_tan)
                mini_damage_tan = math.floor(1.6*mini_damage_tan)
            elif  self.skill_buturi_tan[5]==6:#会心スキル（1.6 or kanstu）
                #貫通
                pre_basic_damage_tan_1 = math.floor(max(0, (power)))
                pre_damage_tan_1 = pre_basic_damage_tan_1*(resist_tan-self.zokusei_tai_hosei/100)*(additional_mag_tan)*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+math.floor(self.zokusei_hosei_tan+self.zokuzen_hosei_tan)/100)*(1+self.keitou_hosei/100)
                pre_damage_tan_1 = math.floor(pre_damage_tan_1)
                #ｘ1.6
                pre_basic_damage_tan_2 = math.floor(max(0, (power)/2 - ((guard+self.syubi_hosei)*(1+0.2*self.skala_hosei)/4)))
                pre_damage_tan_2 = pre_basic_damage_tan_2*1.6*skill_mag_tan*(resist_tan-self.zokusei_tai_hosei/100)*(additional_mag_tan)*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+math.floor(self.zokusei_hosei_tan+self.zokuzen_hosei_tan)/100)*(1+self.keitou_hosei/100)
                pre_damage_tan_2 = math.floor(pre_damage_tan_2)
                
                if pre_damage_tan_1>pre_damage_tan_2:
                    damage_tan = pre_damage_tan_1 #
                    max_damage_tan = math.floor((pre_basic_damage_tan_1+math.floor((pre_basic_damage_tan_1/16)+1))*(resist_tan-self.zokusei_tai_hosei/100)*(additional_mag_tan)*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+math.floor(self.zokusei_hosei_tan+self.zokuzen_hosei_tan)/100)*(1+self.keitou_hosei/100))
                    max_damage_tan = math.floor(max_damage_tan)
   
                    mini_damage_tan = math.floor((pre_basic_damage_tan_1-math.floor((pre_basic_damage_tan_1/16)+1))*(resist_tan-self.zokusei_tai_hosei/100)*(additional_mag_tan)*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+math.floor(self.zokusei_hosei_tan+self.zokuzen_hosei_tan)/100)*(1+self.keitou_hosei/100))
                    mini_damage_tan = math.floor(mini_damage_tan)
                 #   range_basic_damage_tan =math.floor((1+math.floor(pre_basic_damage_tan_1/16))*(resist_tan-self.zokusei_tai_hosei/100)*additional_mag*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+(self.zokusei_hosei+self.zokuzen_hosei)/100)*(1+self.keitou_hosei/100))

                elif pre_damage_tan_2>pre_damage_tan_1:
                    damage_tan = pre_damage_tan_2
                    max_damage_tan = math.floor((pre_basic_damage_tan_2+math.floor((pre_basic_damage_tan_2/16)+1))*1.6*skill_mag_tan*(resist_tan-self.zokusei_tai_hosei/100)*(additional_mag_tan)*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+math.floor(self.zokusei_hosei_tan+self.zokuzen_hosei_tan)/100)*(1+self.keitou_hosei/100))
                    max_damage_tan = math.floor(max_damage_tan)
   
                    mini_damage_tan = math.floor((pre_basic_damage_tan_2-math.floor((pre_basic_damage_tan_2/16)+1))*1.6*skill_mag_tan*(resist_tan-self.zokusei_tai_hosei/100)*(additional_mag_tan)*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+math.floor(self.zokusei_hosei_tan+self.zokuzen_hosei_tan)/100)*(1+self.keitou_hosei/100))
                    mini_damage_tan = math.floor(mini_damage_tan)
                #    range_basic_damage_tan =math.floor((1+math.floor(pre_basic_damage_tan_2/16))*1.6*skill_mag_tan*(resist_tan-self.zokusei_tai_hosei/100)*additional_mag*(1-self.zantaitai_hosei/100)*(1-self.keitou_tai_hosei/100)*(1+(self.zokusei_hosei+self.zokuzen_hosei)/100)*(1+self.keitou_hosei/100))
                damage_center_tan=damage_tan


            else:
                pass

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_34.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター':
            self.ids.calced_status_34.text=str('-')
        elif  self.ids.buturi_tan.text == '単体物理':
            self.ids.calced_status_34.text=str('-')
        elif  (damage_center_tan <= 0) and ((((power))/((guard+self.syubi_hosei)*(1+0.2*self.skala_hosei)))>=4/7):
            self.ids.calced_status_34.text=str('無効')
        elif (((power))<1/2*((guard+self.syubi_hosei)*(1+0.2*self.skala_hosei))):
            self.ids.calced_status_34.text=str('<1/2')
        elif (((power))<4/7*((guard+self.syubi_hosei)*(1+0.2*self.skala_hosei))):
            self.ids.calced_status_34.text=str('<4/7')
        elif self.ids.bousou.active and self.skill_buturi_tan[5]==8:
            self.ids.calced_status_34.text='Select x1 skill'
        else: 
            self.ids.calced_status_34.text=str(damage_center_tan)

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_32.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター':
            self.ids.calced_status_32.text=str('-')
        elif  self.ids.buturi_tan.text == '単体物理':
            self.ids.calced_status_32.text=str('-')
        elif  mini_damage_tan <= 0 and (power>=4/7*(guard+self.syubi_hosei)*(1+0.2*self.skala_hosei)):
            self.ids.calced_status_32.text=str('-')
        elif (power)<4/7*(guard+self.syubi_hosei)*(1+0.2*self.skala_hosei):
            self.ids.calced_status_32.text=str('-')
        elif self.ids.bousou.active and self.skill_buturi_tan[5]==8:
            self.ids.calced_status_32.text='-'
        else: 
            self.ids.calced_status_32.text=str(mini_damage_tan)

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_36.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター':
            self.ids.calced_status_36.text=str('-')
        elif  self.ids.buturi_tan.text == '単体物理':
            self.ids.calced_status_36.text=str('-')
        elif  max_damage_tan <= 0 and (power>=4/7*(guard+self.syubi_hosei)*(1+0.2*self.skala_hosei)):
            self.ids.calced_status_36.text=str('-')
        elif power<4/7*(guard+self.syubi_hosei)*(1+0.2*self.skala_hosei):
            self.ids.calced_status_36.text=str('-')
        elif self.ids.bousou.active and self.skill_buturi_tan[5]==8:
            self.ids.calced_status_36.text='-'
        else: 
            self.ids.calced_status_36.text=str(max_damage_tan)
############残りHP##################
        if self.ids.remHP.active and (self.ids.monster.text != '攻撃モンスター') and (self.ids.monster_2.text != '守備モンスター') and (self.ids.buturi_tan.text != '単体物理'):
            self.ids.calced_status_34.text=str(self.sosituseikaku_monster_2[0]-damage_center_tan)
            self.ids.calced_status_32.text=str(self.sosituseikaku_monster_2[0]-mini_damage_tan)
            self.ids.calced_status_36.text=str(self.sosituseikaku_monster_2[0]-max_damage_tan)

###########################################



#呪文ダメージ関数

    def jumon_damage(self): #（呪文）
        if self.ids.monster.text=='攻撃モンスター':
            self.basic_status=status.default_m
        #    self.basic_status_2=status.default_m
            m_power_int =self.basic_status[4]
            k_power_int =self.basic_status[5]
            power_int =self.basic_status[2]
            kiyousa_int =self.basic_status[7]
        else:
            m_power_int =self.sosituseikaku_monster[4]
            k_power_int =self.sosituseikaku_monster[5]
            power_int =self.sosituseikaku_monster[2]
            kiyousa_int =self.sosituseikaku_monster[7]

        if self.ids.jumon.text=='全・呪ブ':
            self.skill_jumon=data.none
            mini_mpower_int = self.skill_jumon[0] #最低魔力
            mini_power_int = self.skill_jumon[1] #最低威力
            max_mpower_int = self.skill_jumon[2] #最高魔力
            max_power_int = self.skill_jumon[3] #最高威力
            mini_mpower_bint = self.skill_jumon[0] #最低魔力
            mini_power_bint = self.skill_jumon[1] #最低威力
            max_mpower_bint = self.skill_jumon[2] #最高魔力
            max_power_bint = self.skill_jumon[3] #最高威力
        elif self.skill_jumon[5]== 1: #呪文
            mini_mpower_int = self.skill_jumon[0] #最低魔力
            mini_power_int = self.skill_jumon[1] #最低威力
            max_mpower_int = self.skill_jumon[2] #最高魔力
            max_power_int = self.skill_jumon[3] #最高威力
        elif self.skill_jumon[5]==3: #回復
            mini_mpower_int = self.skill_jumon[0] #最低魔力
            mini_power_int = self.skill_jumon[1] #最低威力
            max_mpower_int = self.skill_jumon[2] #最高魔力
            max_power_int = self.skill_jumon[3] #最高威力
        elif self.skill_jumon[5]==2: #ブレス
            mini_mpower_bint = self.skill_jumon[0] #最低魔力
            mini_power_bint = self.skill_jumon[1] #最低威力
            max_mpower_bint = self.skill_jumon[2] #最高魔力
            max_power_bint = self.skill_jumon[3] #最高威力

        #初期値
        (self.zokusei_hosei,
        self.zokuzen_hosei,
        self.keitou_hosei,
        self.kougeki_hosei,
        self.baiki_hosei,
        self.zokusei_tai_hosei,
        self.keitou_tai_hosei,
        self.syubi_hosei,
        self.zantaitai_hosei,
        self.jumontai_hosei,
        self.bretai_hosei,
        self.skala_hosei,
        self.kouma_hosei,
        self.kiyousa_hosei)=self.hosei_syokika()

        zokusei_num_jumon = self.skill_jumon[6] #選択呪文属性
        resist_jumon = self.basic_status_2[zokusei_num_jumon] #属性耐性
        zokusei_num_breath = self.skill_jumon[6] #選択ブレス属性
        resist_breath = self.basic_status_2[zokusei_num_breath]#属性耐性
        #additional_mag=1  #予備
        additional_mag_jumon=1
        additional_mag_breath=1
        if self.ids.force_2.text=='ドルマ' and zokusei_num_jumon==18:
            additional_mag_jumon=0.8
        else:
            pass
        if self.ids.force_2.text=='ドルマ' and zokusei_num_breath==18:
            additional_mag_breath=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag = 1  # 
        if self.ids.kouryu.text == '+1':
            kouryu_mag = 1.2
        elif self.ids.kouryu.text == '+2':
            kouryu_mag = 1.4
        elif self.ids.kouryu.text == '+3':
            kouryu_mag = 1.6
        elif self.ids.kouryu.text == '+4':
            kouryu_mag = 1.8
        else:
            pass
########呪文＆ブレス計算式(全体用)############

        if self.skill_jumon[5]==1: #呪文
            __, damage_jumon, max_basic_damage_m, mini_basic_damage_m, max_damage_jumon, mini_damage_jumon=CalcDamage.damage_jumon(mini_power_int,
                     m_power_int,
                     self.kouma_hosei,
                     mini_mpower_int,
                     max_power_int,
                     max_mpower_int,
                     resist_jumon,
                     self.zokusei_tai_hosei,
                     additional_mag_jumon,
                     self.zokusei_hosei,
                     self.zokuzen_hosei,
                     self.keitou_hosei,
                     self.keitou_tai_hosei,
                     self.jumontai_hosei,
                     self.keitou_tai_hosei,
                     kouryu_mag
                     )

        elif self.skill_jumon[5]==3: #回復呪文
            __, damage_jumon, max_basic_damage_m, mini_basic_damage_m, max_damage_jumon, mini_damage_jumon=CalcDamage.damage_jumon(
                mini_power_int,
                k_power_int,
                self.kouma_hosei,
                mini_mpower_int,
                max_power_int,
                max_mpower_int,
                resist_jumon,
                self.zokusei_tai_hosei,
                additional_mag_jumon,
                self.zokusei_hosei,
                self.zokuzen_hosei,
                self.keitou_hosei,
                self.keitou_tai_hosei,
                self.jumontai_hosei,
                self.keitou_tai_hosei,
                kouryu_mag,
                True
                )

        elif self.skill_jumon[5]==2: #ブレス
            basic_damage_b = (mini_power_bint + ((power_int+self.kougeki_hosei)*(1+0.2*self.baiki_hosei)+kiyousa_int+self.kiyousa_hosei - mini_mpower_bint) * (max_power_bint - mini_power_bint) / (max_mpower_bint - mini_mpower_bint))
            import math
            basic_damage_b=math.floor(basic_damage_b)
            damage_breath = basic_damage_b*(resist_breath-self.zokusei_tai_hosei/100)*additional_mag_breath*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.bretai_hosei/100)

            damage_breath = math.floor(damage_breath)
            max_basic_damage_b = basic_damage_b+math.floor(0.06*basic_damage_b)
            mini_basic_damage_b = basic_damage_b-math.floor(0.06*basic_damage_b)
            max_damage_breath = max_basic_damage_b*(resist_breath-self.zokusei_tai_hosei/100)*additional_mag_breath*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.bretai_hosei/100)
            max_damage_breath =  math.floor(max_damage_breath)
            mini_damage_breath = mini_basic_damage_b*(resist_breath-self.zokusei_tai_hosei/100)*additional_mag_breath*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.bretai_hosei/100)
            mini_damage_breath =  math.floor(mini_damage_breath)
        
        if self.skill_jumon[5]==1:#呪文暴走
            if self.ids.bousou.active:
                import math
                max_basic_damage_m = math.floor(2.0*max_basic_damage_m)
                max_damage_jumon = max_basic_damage_m*(resist_jumon-self.zokusei_tai_hosei/100)*additional_mag_jumon*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.jumontai_hosei/100)
                max_damage_jumon =  math.floor(max_damage_jumon)
                mini_basic_damage_m = math.floor(1.5*mini_basic_damage_m)
                mini_damage_jumon = mini_basic_damage_m*(resist_jumon-self.zokusei_tai_hosei/100)*additional_mag_jumon*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.jumontai_hosei/100)
                mini_damage_jumon =  math.floor(mini_damage_jumon)
                damage_jumon = math.floor((max_damage_jumon+mini_damage_jumon)/2)
            else:
                pass
        elif self.skill_jumon[5]==3:#回復暴走
            if self.ids.bousou.active:
                import math
                max_basic_damage_m = math.floor(2.0*max_basic_damage_m)
                max_damage_jumon = max_basic_damage_m*(1+self.zokusei_hosei/100)*(1+self.zokuzen_hosei/100)
                max_damage_jumon =  math.floor(max_damage_jumon)
                mini_basic_damage_m = math.floor(1.5*mini_basic_damage_m)
                mini_damage_jumon = mini_basic_damage_m*(1+self.zokusei_hosei/100)*(1+self.zokuzen_hosei/100)
                mini_damage_jumon =  math.floor(mini_damage_jumon)
                damage_jumon = math.floor((max_damage_jumon+mini_damage_jumon)/2)
            else:
                pass
        else:
            pass
######初期値##########
        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_40.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター' and self.skill_jumon[5]!= 3:
            self.ids.calced_status_40.text=str('-')
        elif  self.ids.jumon.text == '全・呪ブ':
            self.ids.calced_status_40.text=str('-')
        elif self.skill_jumon[5]==1 and damage_jumon<0: #呪文0
            self.ids.calced_status_40.text=str(0)
        elif self.skill_jumon[5]==1: #呪文
            self.ids.calced_status_40.text=str(damage_jumon)
        elif self.skill_jumon[5]==3: #回復
            self.ids.calced_status_40.text=str(damage_jumon)
        elif self.skill_jumon[5]==2 and damage_breath<0: #ブレス0
            self.ids.calced_status_40.text=str(0)
        elif self.skill_jumon[5]==2: #ブレス
            self.ids.calced_status_40.text=str(damage_breath)

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_38.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター' and self.skill_jumon[5]!= 3:
            self.ids.calced_status_38.text=str('-')
        elif  self.ids.jumon.text == '全・呪ブ':
            self.ids.calced_status_38.text=str('-')
        elif self.skill_jumon[5]==1 and mini_damage_jumon<0: #呪文0
            self.ids.calced_status_38.text=str(0)
        elif self.skill_jumon[5]==1: #呪文
            self.ids.calced_status_38.text=str(mini_damage_jumon)
        elif self.skill_jumon[5]==3: #回復
            self.ids.calced_status_38.text=str(mini_damage_jumon)
        elif self.skill_jumon[5]==2 and mini_damage_breath<0: #ブレス0
            self.ids.calced_status_38.text=str(0)
        elif self.skill_jumon[5]==2: #ブレス
            self.ids.calced_status_38.text=str(mini_damage_breath)    

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_42.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター' and self.skill_jumon[5]!= 3:
            self.ids.calced_status_42.text=str('-')
        elif  self.ids.jumon.text == '全・呪ブ':
            self.ids.calced_status_42.text=str('-')
        elif self.skill_jumon[5]==1 and max_damage_jumon<0: #呪文0
            self.ids.calced_status_42.text=str(0)
        elif self.skill_jumon[5]==1: #呪文
            self.ids.calced_status_42.text=str(max_damage_jumon)
        elif self.skill_jumon[5]==3: #回復
            self.ids.calced_status_42.text=str(max_damage_jumon)
        elif self.skill_jumon[5]==2 and max_damage_breath<0: #ブレス0
            self.ids.calced_status_42.text=str(0)
        elif self.skill_jumon[5]==2: #ブレス
            self.ids.calced_status_42.text=str(max_damage_breath)


############残りHP##################
        if self.ids.remHP.active and (self.ids.monster.text != '攻撃モンスター') and (self.ids.monster_2.text != '守備モンスター') and (self.ids.jumon.text != '全・呪ブ'):
            if self.skill_jumon[5]==1: #呪文
                self.ids.calced_status_40.text=str(self.sosituseikaku_monster_2[0]-damage_jumon)
            elif self.skill_jumon[5]==2: #ブレス
                self.ids.calced_status_40.text=str(self.sosituseikaku_monster_2[0]-damage_breath) 
            if self.skill_jumon[5]==1: #呪文
                self.ids.calced_status_38.text=str(self.sosituseikaku_monster_2[0]-mini_damage_jumon)
            elif self.skill_jumon[5]==2: #ブレス
                self.ids.calced_status_38.text=str(self.sosituseikaku_monster_2[0]-mini_damage_breath) 
            if self.skill_jumon[5]==1: #呪文
                self.ids.calced_status_42.text=str(self.sosituseikaku_monster_2[0]-max_damage_jumon)
            elif self.skill_jumon[5]==2: #ブレス
                self.ids.calced_status_42.text=str(self.sosituseikaku_monster_2[0]-max_damage_breath) 
###########################################


#単体呪文ブレスダメージ関数
    def breath_damage(self): #基礎威力関数（呪文ブレス）
        if self.ids.monster.text=='攻撃モンスター':
            self.basic_status=status.default_m
            m_power_int =self.basic_status[4]
            k_power_int =self.basic_status[5]
            power_int =self.basic_status[2]
            kiyousa_int =self.basic_status[7]
        else:
            m_power_int =self.sosituseikaku_monster[4]
            power_int =self.sosituseikaku_monster[2]
            kiyousa_int =self.sosituseikaku_monster[7]
            k_power_int =self.sosituseikaku_monster[5]
 
        if self.ids.breath.text=='単・呪ブ':
            self.skill_breath=data.none
            mini_mpower_int2 = self.skill_breath[0] #最低魔力
            mini_power_int2 = self.skill_breath[1] #最低威力
            max_mpower_int2 = self.skill_breath[2] #最高魔力
            max_power_int2 = self.skill_breath[3] #最高威力
            mini_mpower_bint2 = self.skill_breath[0] #最低魔力
            mini_power_bint2 = self.skill_breath[1] #最低威力
            max_mpower_bint2 = self.skill_breath[2] #最高魔力
            max_power_bint2 = self.skill_breath[3] #最高威力
        elif self.skill_breath[5]==1: #呪文
            mini_mpower_int2 = self.skill_breath[0] #最低魔力
            mini_power_int2 = self.skill_breath[1] #最低威力
            max_mpower_int2 = self.skill_breath[2] #最高魔力
            max_power_int2 = self.skill_breath[3] #最高威力
        elif self.skill_breath[5]==3: #回復
            mini_mpower_int2 = self.skill_breath[0] #最低魔力
            mini_power_int2 = self.skill_breath[1] #最低威力
            max_mpower_int2 = self.skill_breath[2] #最高魔力
            max_power_int2 = self.skill_breath[3] #最高威力
        elif self.skill_breath[5]==2: #ブレス
            mini_mpower_bint2 = self.skill_breath[0] #最低魔力
            mini_power_bint2 = self.skill_breath[1] #最低威力
            max_mpower_bint2 = self.skill_breath[2] #最高魔力
            max_power_bint2 = self.skill_breath[3] #最高威力
    ###初期値設定####
        #初期値
        (self.zokusei_hosei,
        self.zokuzen_hosei,
        self.keitou_hosei,
        self.kougeki_hosei,
        self.baiki_hosei,
        self.zokusei_tai_hosei,
        self.keitou_tai_hosei,
        self.syubi_hosei,
        self.zantaitai_hosei,
        self.jumontai_hosei,
        self.bretai_hosei,
        self.skala_hosei,
        self.kouma_hosei,
        self.kiyousa_hosei)=self.hosei_syokika()

        zokusei_num_breath2 = self.skill_breath[6] #選択呪文属性
        resist_jumon_tan = self.basic_status_2[zokusei_num_breath2] #属性耐性
        zokusei_num_breath = self.skill_breath[6] #選択ブレス属性
        resist_breath_tan = self.basic_status_2[zokusei_num_breath]#属性耐性
        additional_mag_jumon_tan=1
        additional_mag_breath_tan=1
        if self.ids.force_2.text=='ドルマ' and zokusei_num_breath2==18:
            additional_mag_jumon_tan=0.8
        else:
            pass

        if self.ids.force_2.text=='ドルマ' and zokusei_num_breath==18:
            additional_mag_breath_tan=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag = 1  # 
        if self.ids.kouryu.text == '+1':
            kouryu_mag = 1.2
        elif self.ids.kouryu.text == '+2':
            kouryu_mag = 1.4
        elif self.ids.kouryu.text == '+3':
            kouryu_mag = 1.6
        elif self.ids.kouryu.text == '+4':
            kouryu_mag = 1.8
        else:
            pass

#########呪文＆ブレス計算式(単体用)##########

        if self.skill_breath[5]==1: #呪文
            __, damage_jumon2, max_basic_damage_m2, mini_basic_damage_m2, max_damage_jumon2, mini_damage_jumon2=CalcDamage.damage_jumon(
                mini_power_int2,
                m_power_int,
                self.kouma_hosei,
                mini_mpower_int2,
                max_power_int2,
                max_mpower_int2,
                resist_jumon_tan,
                self.zokusei_tai_hosei,
                additional_mag_jumon_tan,
                self.zokusei_hosei,
                self.zokuzen_hosei,
                self.keitou_hosei,
                self.keitou_tai_hosei,
                self.jumontai_hosei,
                self.keitou_tai_hosei,
                kouryu_mag
                )

        elif self.skill_breath[5]==3: #回復
            __, damage_jumon2, max_basic_damage_b2, mini_basic_damage_b2, max_damage_jumon2, mini_damage_jumon2=CalcDamage.damage_jumon(
                mini_power_int2,
                k_power_int,
                self.kouma_hosei,
                mini_mpower_int2,
                max_power_int2,
                max_mpower_int2,
                resist_jumon_tan,
                self.zokusei_tai_hosei,
                additional_mag_jumon_tan,
                self.zokusei_hosei,
                self.zokuzen_hosei,
                self.keitou_hosei,
                self.keitou_tai_hosei,
                self.jumontai_hosei,
                self.keitou_tai_hosei,
                kouryu_mag,
                True
                )

        elif self.skill_breath[5]==2: #ブレス
            basic_damage_b2 = (mini_power_bint2 + ((power_int+self.kougeki_hosei)*(1+0.2*self.baiki_hosei)+kiyousa_int+self.kiyousa_hosei - mini_mpower_bint2) * (max_power_bint2 - mini_power_bint2) / (max_mpower_bint2 - mini_mpower_bint2))
            import math
            basic_damage_b2=math.floor(basic_damage_b2)
            damage_breath2 = basic_damage_b2*(resist_breath_tan-self.zokusei_tai_hosei/100)*additional_mag_breath_tan*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.bretai_hosei/100)

            damage_breath2 = math.floor(damage_breath2)
            max_basic_damage_b2 = basic_damage_b2+math.floor(0.06*basic_damage_b2)
            mini_basic_damage_b2 = basic_damage_b2-math.floor(0.06*basic_damage_b2)
            max_damage_breath2 = max_basic_damage_b2*(resist_breath_tan-self.zokusei_tai_hosei/100)*additional_mag_breath_tan*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.bretai_hosei/100)
            max_damage_breath2 =  math.floor(max_damage_breath2)
            mini_damage_breath2 = mini_basic_damage_b2*(resist_breath_tan-self.zokusei_tai_hosei/100)*additional_mag_breath_tan*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.bretai_hosei/100)
            mini_damage_breath2 =  math.floor(mini_damage_breath2)

        if self.skill_breath[5]== 1 : #呪文暴走
            if  self.ids.bousou.active:
                import math
                max_basic_damage_m2 = math.floor(2.0*max_basic_damage_m2)
                max_damage_jumon2 = max_basic_damage_m2*(resist_jumon_tan-self.zokusei_tai_hosei/100)*additional_mag_jumon_tan*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.jumontai_hosei/100)
                max_damage_jumon2 =  math.floor(max_damage_jumon2)

                mini_basic_damage_m2 = math.floor(1.5*mini_basic_damage_m2)
                mini_damage_jumon2 = mini_basic_damage_m2*(resist_jumon_tan-self.zokusei_tai_hosei/100)*additional_mag_jumon_tan*kouryu_mag*(1+self.zokusei_hosei/100+self.zokuzen_hosei/100)*(1+self.keitou_hosei/100)*(1-self.keitou_tai_hosei/100)*(1-self.jumontai_hosei/100)
                mini_damage_jumon2 =  math.floor(mini_damage_jumon2)
                damage_jumon2 = (max_damage_jumon2+mini_damage_jumon2)/2
            else:
                pass
        elif self.skill_breath[5]== 3 : #回復暴走
            if  self.ids.bousou.active:
                import math
                max_basic_damage_m2 = math.floor(2.0*max_basic_damage_m2)
                max_damage_jumon2 = max_basic_damage_m2*(1+self.zokusei_hosei/100)*(1+self.zokuzen_hosei/100)
                max_damage_jumon2 =  math.floor(max_damage_jumon2)

                mini_basic_damage_m2 = math.floor(1.5*mini_basic_damage_m2)
                mini_damage_jumon2 = mini_basic_damage_m2*(1+self.zokusei_hosei/100)*(1+self.zokuzen_hosei/100)
                mini_damage_jumon2 =  math.floor(mini_damage_jumon2)
                damage_jumon2 = (max_damage_jumon2+mini_damage_jumon2)/2
            else:
                pass                
                
        else:
            pass
######初期値##########
        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_46.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター' and self.skill_breath[5]!=3:
            self.ids.calced_status_46.text=str('-')
        elif  self.ids.breath.text == '単・呪ブ':
            self.ids.calced_status_46.text=str('-')
        elif self.skill_breath[5]==1 and damage_jumon2<0: #呪文0
            self.ids.calced_status_46.text=str(0)
        elif self.skill_breath[5]==1: #呪文
            self.ids.calced_status_46.text=str(damage_jumon2)
        elif self.skill_breath[5]==3: #回復
            self.ids.calced_status_46.text=str(damage_jumon2)
        elif self.skill_breath[5]==2 and damage_breath2<0: #ブレス0
            self.ids.calced_status_46.text=str(0)
        elif self.skill_breath[5]==2: #ブレス
            self.ids.calced_status_46.text=str(damage_breath2)

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_44.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター' and self.skill_breath[5]!=3:
            self.ids.calced_status_44.text=str('-')
        elif  self.ids.breath.text == '単・呪ブ':
            self.ids.calced_status_44.text=str('-')
        elif self.skill_breath[5]==1 and mini_damage_jumon2<0: #呪文0
            self.ids.calced_status_44.text=str(0)
        elif self.skill_breath[5]==1: #呪文
            self.ids.calced_status_44.text=str(mini_damage_jumon2)
        elif self.skill_breath[5]==3: #回復
            self.ids.calced_status_44.text=str(mini_damage_jumon2)
        elif self.skill_breath[5]==2 and mini_damage_breath2<0: #ブレス0
            self.ids.calced_status_44.text=str(0)
        elif self.skill_breath[5]==2: #ブレス
            self.ids.calced_status_44.text=str(mini_damage_breath2)    

        if self.ids.monster.text == '攻撃モンスター':
            self.ids.calced_status_48.text=str('-')
        elif  self.ids.monster_2.text == '守備モンスター' and self.skill_breath[5]!=3:
            self.ids.calced_status_48.text=str('-')
        elif  self.ids.breath.text == '単・呪ブ':
            self.ids.calced_status_48.text=str('-')
        elif self.skill_breath[5]==1 and max_damage_jumon2<0: #呪文0
            self.ids.calced_status_48.text=str(0)
        elif self.skill_breath[5]==1: #呪文
            self.ids.calced_status_48.text=str(max_damage_jumon2)
        elif self.skill_breath[5]==3: #回復
            self.ids.calced_status_48.text=str(max_damage_jumon2)
        elif self.skill_breath[5]==2 and max_damage_breath2<0: #ブレス0
            self.ids.calced_status_48.text=str(0)
        elif self.skill_breath[5]==2: #ブレス
            self.ids.calced_status_48.text=str(max_damage_breath2)


############残りHP##################
        if self.ids.remHP.active and (self.ids.monster.text != '攻撃モンスター') and (self.ids.monster_2.text != '守備モンスター') and (self.ids.breath.text != '単・呪ブ'):
            if self.skill_breath[5]==1: #呪文
                self.ids.calced_status_46.text=str(self.sosituseikaku_monster_2[0]-damage_jumon2)
            elif self.skill_breath[5]==2: #ブレス
                self.ids.calced_status_46.text=str(self.sosituseikaku_monster_2[0]-damage_breath2) 
            if self.skill_breath[5]==1: #呪文
                self.ids.calced_status_44.text=str(self.sosituseikaku_monster_2[0]-mini_damage_jumon2)
            elif self.skill_breath[5]==2: #ブレス
                self.ids.calced_status_44.text=str(self.sosituseikaku_monster_2[0]-mini_damage_breath2) 
            if self.skill_breath[5]==1: #呪文
                self.ids.calced_status_48.text=str(self.sosituseikaku_monster_2[0]-max_damage_jumon2)
            elif self.skill_breath[5]==2: #ブレス
                self.ids.calced_status_48.text=str(self.sosituseikaku_monster_2[0]-max_damage_breath2) 


##################################################################################

    
    def on_sositu_selection(self,text):
        self.sositu_hosei=Generate_Monster.sositu_selection(self.ids.sositu.text)
        return self.sositu_hosei

    def on_sositu_selection_2(self, text):
        self.sositu_hosei_2=Generate_Monster.sositu_selection(self.ids.sositu_2.text)
        return self.sositu_hosei_2
        

    def on_seikaku_selection(self, text):
        self.seikaku_hosei = Generate_Monster.seikaku_selection(self.ids.seikaku.text)
        #print("seikaku-wa", text, "hosei-wa", self.seikaku_hosei)
        return self.seikaku_hosei
    
    def on_seikaku_selection_2(self, text):
        self.seikaku_hosei_2=Generate_Monster.seikaku_selection(self.ids.seikaku_2.text)
        #print("seikaku2-wa",text,"hosei2-wa",self.seikaku_hosei_2)
        return self.seikaku_hosei_2

    def on_monster_selection(self,text):
        self.basic_status=Generate_Monster.monster_selection(self.ids.monster.text)
        return self.basic_status

    def on_monster_selection_2(self,text):
        self.basic_status_2=Generate_Monster.monster_selection(self.ids.monster_2.text)
        return self.basic_status_2
    
######スキルselection##########
#全体物理

    def update_status(self, attribute_mapping, status_id, skill_value, force_text=None):
        if force_text and skill_value == 10 and self.ids.force.text == force_text:
            self.ids[status_id].text = "ドルフォ"
        else:
            self.ids[status_id].text = attribute_mapping.get(skill_value, "")

    def on_buturi_zen_selection(self, text):
        self.skill_buturi_zen, display_text = Generate_Monster.buturi_zen_selection(self.ids.buturi_zen.text, self.basic_status_2)

        if self.skill_buturi_zen:
            self.ids.calced_status_25.text = display_text
        else:
            self.ids.calced_status_25.text = '-'

        attribute_mapping = {
            10: "無属性",
            11: "メラ",
            12: "ギラ",
            13: "イオ",
            14: "ヒャド",
            15: "バギ",
            16: "ジバ",
            17: "デイン",
            18: "ドルマ",
            37: "ザバ",
        }

        if text == '全体物理':
            self.ids.calced_status_101.text = "-"
        else:
            if self.skill_buturi_zen:
                self.update_status(attribute_mapping, 'calced_status_101', self.skill_buturi_zen[6], 'ドルマ')

        specific_checks = {
            'メイルスト': 5,
            '火炎裂空脚': 9,
        }

        if not (text in specific_checks and self.basic_status_2[34] == specific_checks[text]):
            self.ids.calced_status_25.text = display_text

#属性[6](10無 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル,19全体回復)
#単体物理

    def on_buturi_tan_selection(self, text):
        self.skill_buturi_tan, display_text = Generate_Monster.buturi_tan_selection(self.ids.buturi_tan.text, self.basic_status_2)

        if self.skill_buturi_tan:
            self.ids.calced_status_31.text = display_text
        else:
            self.ids.calced_status_31.text = '-'

        attribute_mapping = {
            10: "無属性",
            11: "メラ",
            12: "ギラ",
            13: "イオ",
            14: "ヒャド",
            15: "バギ",
            16: "ジバ",
            17: "デイン",
            18: "ドルマ",
            37: "ザバ",
        }

        if text == '単体物理':
            self.ids.calced_status_102.text = "-"
        else:
            if self.skill_buturi_tan:
                self.update_status(attribute_mapping, 'calced_status_102', self.skill_buturi_tan[6], 'ドルマ')

#34系統: 0けもの 1ドラゴン 2物質 3エレメント 4ゾンビ 5水 6悪魔 7植物 8スライム 9鳥 10？？？ 11マシン 12虫 13怪人

#全呪・ブレ

    def on_jumon_selection(self, text):
        self.skill_jumon = Generate_Monster.jumon_selection(self.ids.jumon.text)

        attribute_mapping = {
            10: "無属性",
            11: "メラ",
            12: "ギラ",
            13: "イオ",
            14: "ヒャド",
            15: "バギ",
            16: "ジバ",
            17: "デイン",
            18: "ドルマ",
            37: "ザバ",
            20: "回復",
        }

        if self.ids.jumon.text == '全・呪ブ':
            self.ids.calced_status_103.text = "-"
        else:
            self.update_status(attribute_mapping, 'calced_status_103', self.skill_jumon[6])

        self.ids.calced_status_37.text = str(self.ids.jumon.text)

#単呪・ブレ

    def on_breath_selection(self, text):
        self.skill_breath = Generate_Monster.breath_selection(self.ids.breath.text)

        attribute_mapping = {
            10: "無属性",
            11: "メラ",
            12: "ギラ",
            13: "イオ",
            14: "ヒャド",
            15: "バギ",
            16: "ジバ",
            17: "デイン",
            18: "ドルマ",
            37: "ザバ",
            19: "回復",
        }

        if self.ids.breath.text == '単・呪ブ':
            self.ids.calced_status_104.text = "-"
        else:
            self.update_status(attribute_mapping, 'calced_status_104', self.skill_breath[6])

        self.ids.calced_status_43.text = str(self.ids.breath.text)



######攻撃継承selection##########


    def on_selection(self, field_name, attribute_name, is_numeric=True):
        field_value = self.ids[field_name].text
        import re
        if is_numeric:
            setattr(self, attribute_name, int(re.sub(r"\D", "", field_value)))
        else:
            setattr(self, attribute_name, field_value)

    def on_zokusei_selection(self, text):
        self.on_selection('zokusei', 'zokusei_hosei')

    def on_zokuzen_selection(self, text):
        self.on_selection('zokuzen', 'zokuzen_hosei')

    def on_keitou_selection(self, text):
        self.on_selection('keitou', 'keitou_hosei')

    def on_kougeki_selection(self, text):
        self.on_selection('kougeki', 'kougeki_hosei')

    def on_kouma_selection(self, text):
        self.on_selection('kouma', 'kouma_hosei')

    def on_kiyousa_selection(self, text):
        self.on_selection('kiyousa', 'kiyousa_hosei')

    def on_baiki_selection(self,text):
        self.baiki_hosei=int(self.ids.baiki.text)



#######################################

######守備継承selection##########

    def on_zokusei_tai_selection(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.zokusei_tai.text)
        self.zokusei_tai_hosei = int(val) if val else 0
        #print(self.zokusei_tai_hosei)


    def on_keitou_tai_selection(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.keitou_tai.text)
        self.keitou_tai_hosei = int(val) if val else 0
        #print(self.keitou_tai_hosei)

    def on_syubi_selection(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.syubi.text)
        self.syubi_hosei = int(val) if val else 0
        #print(self.syubi_hosei)

    def on_zantaitai_selection(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.zantaitai.text)
        self.zantaitai_hosei = int(val) if val else 0
        #print(self.zantaitai_hosei)

    def on_jumontai_selection(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.jumontai.text)
        self.jumontai_hosei = int(val) if val else 0
        #print(self.jumontai_hosei)

    def on_bretai_selection(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.bretai.text)
        self.bretai_hosei = int(val) if val else 0
        #print(self.bretai_hosei)

    def on_skala_selection(self,text):
        self.skala_hosei=int(self.ids.skala.text)

        #print(self.skala_hosei)

    def on_reset_press(self,text):
        self.ids.buturi_zen.text='全体物理'
        self.ids.buturi_tan.text='単体物理'
        self.ids.jumon.text='全・呪ブ'
        self.ids.breath.text='単・呪ブ'
        self.ids.monster.text='攻撃モンスター'
        self.ids.sositu.text='素質'
        self.ids.seikaku.text='性格'
        self.ids.monster_2.text='守備モンスター'
        self.ids.sositu_2.text='素質'
        self.ids.seikaku_2.text='性格'
        self.ids.zokusei.text='0'
        self.ids.zokuzen.text='0'
        self.ids.keitou.text='0'
        self.ids.kougeki.text='0'
        self.ids.kouma.text='0'
        self.ids.kiyousa.text='0'
        self.ids.baiki.text='0'
        self.ids.zokusei_tai.text='0'
        self.ids.keitou_tai.text='0'
        self.ids.syubi.text='0'
        self.ids.zantaitai.text='0'
        self.ids.jumontai.text='0'
        self.ids.bretai.text='0'
        self.ids.skala.text='0'
        #self.ids.bousou=self.ids.bousou.active

        
#######################################
###攻撃モンスタselection######
    def sosituseikaku(self):
 
        if self.ids.sositu.text=='素質':
            self.sositu_hosei=1
        else:
            pass
        if self.ids.seikaku.text=='性格':
            self.seikaku_hosei=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster.text=='攻撃モンスター':
            self.basic_status=status.default_m
        else:
            pass


        import math
        self.sosituseikaku_monster = [math.ceil(self.sositu_hosei*self.seikaku_hosei[0]*self.basic_status[0]), math.ceil(self.sositu_hosei*self.seikaku_hosei[1]*self.basic_status[1]), math.ceil(self.sositu_hosei*self.seikaku_hosei[2]*self.basic_status[2]), math.ceil(self.sositu_hosei*self.seikaku_hosei[3]*self.basic_status[3]), math.ceil(self.sositu_hosei*self.seikaku_hosei[4]*self.basic_status[4]), math.ceil(self.sositu_hosei*self.seikaku_hosei[5]*self.basic_status[5]), math.ceil(self.sositu_hosei*self.seikaku_hosei[6]*self.basic_status[6]), math.ceil(self.sositu_hosei*self.seikaku_hosei[7]*self.basic_status[7]), self.basic_status[8], self.basic_status[9], self.basic_status[10], self.basic_status[11], self.basic_status[12], self.basic_status[13], self.basic_status[14], self.basic_status[15], self.basic_status[16], self.basic_status[17], self.basic_status[18], self.basic_status[19]] 
        print("final_status-wa",self.sosituseikaku_monster)
        HP=str(self.sosituseikaku_monster[0])
        MP=str(self.sosituseikaku_monster[1])
        tikara=str(self.sosituseikaku_monster[2])
        mamori=str(self.sosituseikaku_monster[3])
        kouma=str(self.sosituseikaku_monster[4])
        kaima=str(self.sosituseikaku_monster[5])
        suba=str(self.sosituseikaku_monster[6])
        kiyou=str(self.sosituseikaku_monster[7])

        self.ids.calced_status_4.text=str(tikara)
        self.ids.calced_status_5.text=str(kouma)
        self.ids.calced_status_6.text=str(int(tikara)+int(kiyou))
        self.ids.calced_status_52.text=str(int(kaima))


###守備モンスタselection#####

    def sosituseikaku_2(self):
        if self.ids.sositu_2.text=='素質':
            self.sositu_hosei_2=1
        else:
            pass
        if self.ids.seikaku_2.text=='性格':
            self.seikaku_hosei_2=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster_2.text=='守備モンスター':
            self.basic_status_2=status.default_m
        else:
            pass
        #print("素質",self.ids.sositu_2.text)
        #print("性格",self.ids.seikaku_2.text)
        #print("モンスター",self.ids.monster_2.text)
        #print(self.basic_status)
        import math
        self.sosituseikaku_monster_2 = [math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[0]*self.basic_status_2[0]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[1]*self.basic_status_2[1]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[2]*self.basic_status_2[2]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[3]*self.basic_status_2[3]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[4]*self.basic_status_2[4]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[5]*self.basic_status_2[5]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[6]*self.basic_status_2[6]), math.ceil(self.sositu_hosei_2*self.seikaku_hosei_2[7]*self.basic_status_2[7]), self.basic_status_2[8], self.basic_status_2[9], self.basic_status_2[10], self.basic_status_2[11], self.basic_status_2[12], self.basic_status_2[13], self.basic_status_2[14], self.basic_status_2[15], self.basic_status_2[16], self.basic_status_2[17], self.basic_status_2[18], self.basic_status_2[19]] 
        #print("final_status-wa",self.sosituseikaku_monster)
        HP=str(self.sosituseikaku_monster_2[0])
        MP=str(self.sosituseikaku_monster_2[1])
        tikara=str(self.sosituseikaku_monster_2[2])
        mamori=str(self.sosituseikaku_monster_2[3])
        kouma=str(self.sosituseikaku_monster_2[4])
        kaima=str(self.sosituseikaku_monster_2[5])
        suba=str(self.sosituseikaku_monster_2[6])
        kiyou=str(self.sosituseikaku_monster_2[7])

        self.ids.calced_status_16.text=str(mamori)
        self.ids.calced_status_49.text=str(HP)
    
        
        self.ids.calced_status_17.text=str(math.floor(100*(1-self.basic_status_2[11])))
        self.ids.calced_status_18.text=str(math.floor(100*(1-self.basic_status_2[12])))
        self.ids.calced_status_19.text=str(math.floor(100*(1-self.basic_status_2[13])))
        self.ids.calced_status_20.text=str(math.floor(100*(1-self.basic_status_2[14])))
        self.ids.calced_status_21.text=str(math.floor(100*(1-self.basic_status_2[15])))
        self.ids.calced_status_22.text=str(math.floor(100*(1-self.basic_status_2[16])))
        self.ids.calced_status_23.text=str(math.floor(100*(1-self.basic_status_2[17])))
        self.ids.calced_status_24.text=str(math.floor(100*(1-self.basic_status_2[18])))
        self.ids.calced_status_130.text=str(math.floor(100*(1-self.basic_status_2[37]))) #37ザバ
#########################呼びステ##################################################
class YobisuteTab(StackLayout):
    def __init__(self, root_widget=None, **kwargs):
        super(YobisuteTab, self).__init__(**kwargs)
        self.bind(on_kv_post=self._on_kv_post)

    def _on_kv_post(self, base_widget, root_widget):
    #モンスター選択
        self.ids.monster_yobi.values= data.monster_lst
        self.ids.monster_yobi_2.values= data.monster_lst
#######################################################################################
#########################呼びステ##################################################
    def on_sositu_selection_yobi(self,text):
        self.sositu_hosei_yobi=Generate_Monster.sositu_selection(self.ids.sositu_yobi.text)
        return self.sositu_hosei_yobi

    def on_sositu_selection_yobi_2(self, text):
        self.sositu_hosei_yobi_2=Generate_Monster.sositu_selection(self.ids.sositu_yobi_2.text)
        return self.sositu_hosei_yobi_2

    def on_seikaku_selection_yobi(self, text):
        self.seikaku_hosei_yobi=Generate_Monster.seikaku_selection(self.ids.seikaku_yobi.text)
        print("seikaku-wa",text,"hosei-wa",self.seikaku_hosei_yobi)
        return self.seikaku_hosei_yobi

    def on_seikaku_selection_yobi_2(self, text):
        self.seikaku_hosei_yobi_2=Generate_Monster.seikaku_selection(self.ids.seikaku_yobi_2.text)
        #print("seikaku2-wa",text,"hosei2-wa",self.seikaku_hosei_2)
        return self.seikaku_hosei_yobi_2



    def on_monster_selection_yobi(self,text):
        self.basic_status_yobi=Generate_Monster.monster_selection(self.ids.monster_yobi.text)
        return self.basic_status_yobi

    def on_monster_selection_yobi_2(self,text):
        self.basic_status_yobi_2=Generate_Monster.monster_selection(self.ids.monster_yobi_2.text)
        return self.basic_status_yobi_2


    def sosituseikaku_yobi(self):
        if self.ids.sositu_yobi.text=='素質':
            self.sositu_hosei_yobi=1
        else:
            pass
        if self.ids.seikaku_yobi.text=='性格':
            self.seikaku_hosei_yobi=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster_yobi.text=='モンスター':
            self.basic_status_yobi=status.default_m
        else:
            pass



        import math
        self.sosituseikaku_monster_yobi = [math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[0]*self.basic_status_yobi[0]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[1]*self.basic_status_yobi[1]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[2]*self.basic_status_yobi[2]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[3]*self.basic_status_yobi[3]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[4]*self.basic_status_yobi[4]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[5]*self.basic_status_yobi[5]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[6]*self.basic_status_yobi[6]),
                                        math.ceil(self.sositu_hosei_yobi*self.seikaku_hosei_yobi[7]*self.basic_status_yobi[7]),
                                        self.basic_status_yobi[8], self.basic_status_yobi[9], self.basic_status_yobi[10],
                                        self.basic_status_yobi[11], self.basic_status_yobi[12], self.basic_status_yobi[13],
                                        self.basic_status_yobi[14], self.basic_status_yobi[15], self.basic_status_yobi[16],
                                        self.basic_status_yobi[17], self.basic_status_yobi[18], self.basic_status_yobi[19],
                                        self.basic_status_yobi[37]] 
        #print("final_status-wa",self.sosituseikaku_monster_yobi)
        HP=str(self.sosituseikaku_monster_yobi[0])
        MP=str(self.sosituseikaku_monster_yobi[1])
        tikara=str(self.sosituseikaku_monster_yobi[2])
        mamori=str(self.sosituseikaku_monster_yobi[3])
        kouma=str(self.sosituseikaku_monster_yobi[4])
        kaima=str(self.sosituseikaku_monster_yobi[5])
        suba=str(self.sosituseikaku_monster_yobi[6])
        kiyou=str(self.sosituseikaku_monster_yobi[7])
        self.ids.calced_status_yobi_2.text=str(HP)
        self.ids.calced_status_yobi_4.text=str(MP)
        self.ids.calced_status_yobi_6.text=str(tikara)
        self.ids.calced_status_yobi_8.text=str(mamori)
        self.ids.calced_status_yobi_10.text=str(kouma)
        self.ids.calced_status_yobi_12.text=str(kaima)
        self.ids.calced_status_yobi_14.text=str(suba)
        self.ids.calced_status_yobi_16.text=str(kiyou)
        self.ids.calced_status_yobi_41.text=str(math.floor(100*(1-self.basic_status_yobi[11])))
        self.ids.calced_status_yobi_42.text=str(math.floor(100*(1-self.basic_status_yobi[12])))
        self.ids.calced_status_yobi_43.text=str(math.floor(100*(1-self.basic_status_yobi[13])))
        self.ids.calced_status_yobi_44.text=str(math.floor(100*(1-self.basic_status_yobi[14])))
        self.ids.calced_status_yobi_45.text=str(math.floor(100*(1-self.basic_status_yobi[15])))
        self.ids.calced_status_yobi_46.text=str(math.floor(100*(1-self.basic_status_yobi[16])))
        self.ids.calced_status_yobi_47.text=str(math.floor(100*(1-self.basic_status_yobi[17])))
        self.ids.calced_status_yobi_48.text=str(math.floor(100*(1-self.basic_status_yobi[18])))
        self.ids.calced_status_yobi_131.text=str(math.floor(100*(1-self.basic_status_yobi[37])))

        self.ids.calced_status_yobi_72.text=str(self.basic_status_yobi[20])
        self.ids.calced_status_yobi_73.text=str(self.basic_status_yobi[21])
        self.ids.calced_status_yobi_74.text=str(self.basic_status_yobi[22])
        self.ids.calced_status_yobi_75.text=str(self.basic_status_yobi[23])
        self.ids.calced_status_yobi_76.text=str(self.basic_status_yobi[24])
        self.ids.calced_status_yobi_77.text=str(self.basic_status_yobi[25])
        self.ids.calced_status_yobi_78.text=str(self.basic_status_yobi[26])
        self.ids.calced_status_yobi_86.text=str(self.basic_status_yobi[27])
        self.ids.calced_status_yobi_87.text=str(self.basic_status_yobi[28])
        self.ids.calced_status_yobi_88.text=str(self.basic_status_yobi[29])
        self.ids.calced_status_yobi_89.text=str(self.basic_status_yobi[30])
        self.ids.calced_status_yobi_90.text=str(self.basic_status_yobi[31])
        self.ids.calced_status_yobi_91.text=str(self.basic_status_yobi[32])
        self.ids.calced_status_yobi_92.text=str(self.basic_status_yobi[33])
        #属性弱点耐性 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル
#20眠,21マ,22混,23幻,24毒,25死,26呪,
#27休,28封,29魅,30攻↓,31守↓,32早↓,33呪耐↓

    def sosituseikaku_yobi_2(self):
        if self.ids.sositu_yobi_2.text=='素質':
            self.sositu_hosei_yobi_2=1
        else:
            pass
        if self.ids.seikaku_yobi_2.text=='性格':
            self.seikaku_hosei_yobi_2=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster_yobi_2.text=='モンスター':
            self.basic_status_yobi_2=status.default_m
        else:
            pass
        #print("素質",self.ids.sositu_yobi_2.text)
        #print("性格",self.ids.seikaku_yobi_2.text)
        #print("モンスター",self.ids.monster_2_yobi.text)
        #print(self.basic_status_yobi)
        import math
        self.sosituseikaku_monster_yobi_2 = [math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[0]*self.basic_status_yobi_2[0]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[1]*self.basic_status_yobi_2[1]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[2]*self.basic_status_yobi_2[2]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[3]*self.basic_status_yobi_2[3]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[4]*self.basic_status_yobi_2[4]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[5]*self.basic_status_yobi_2[5]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[6]*self.basic_status_yobi_2[6]),
                                            math.ceil(self.sositu_hosei_yobi_2*self.seikaku_hosei_yobi_2[7]*self.basic_status_yobi_2[7]),
                                            self.basic_status_yobi_2[8], self.basic_status_yobi_2[9], self.basic_status_yobi_2[10],
                                            self.basic_status_yobi_2[11], self.basic_status_yobi_2[12], self.basic_status_yobi_2[13],
                                            self.basic_status_yobi_2[14], self.basic_status_yobi_2[15], self.basic_status_yobi_2[16],
                                            self.basic_status_yobi_2[17], self.basic_status_yobi_2[18], self.basic_status_yobi_2[19],
                                            self.basic_status_yobi_2[37]] 
        #print("final_status-wa",self.sosituseikaku_monster_yobi)
        HP=str(self.sosituseikaku_monster_yobi_2[0])
        MP=str(self.sosituseikaku_monster_yobi_2[1])
        tikara=str(self.sosituseikaku_monster_yobi_2[2])
        mamori=str(self.sosituseikaku_monster_yobi_2[3])
        kouma=str(self.sosituseikaku_monster_yobi_2[4])
        kaima=str(self.sosituseikaku_monster_yobi_2[5])
        suba=str(self.sosituseikaku_monster_yobi_2[6])
        kiyou=str(self.sosituseikaku_monster_yobi_2[7])
        self.ids.calced_status_yobi_18.text=str(HP)
        self.ids.calced_status_yobi_20.text=str(MP)
        self.ids.calced_status_yobi_22.text=str(tikara)
        self.ids.calced_status_yobi_24.text=str(mamori)
        self.ids.calced_status_yobi_26.text=str(kouma)
        self.ids.calced_status_yobi_28.text=str(kaima)
        self.ids.calced_status_yobi_30.text=str(suba)
        self.ids.calced_status_yobi_32.text=str(kiyou)
        self.ids.calced_status_yobi_57.text=str(math.floor(100*(1-self.basic_status_yobi_2[11])))
        self.ids.calced_status_yobi_58.text=str(math.floor(100*(1-self.basic_status_yobi_2[12])))
        self.ids.calced_status_yobi_59.text=str(math.floor(100*(1-self.basic_status_yobi_2[13])))
        self.ids.calced_status_yobi_60.text=str(math.floor(100*(1-self.basic_status_yobi_2[14])))
        self.ids.calced_status_yobi_61.text=str(math.floor(100*(1-self.basic_status_yobi_2[15])))
        self.ids.calced_status_yobi_62.text=str(math.floor(100*(1-self.basic_status_yobi_2[16])))
        self.ids.calced_status_yobi_63.text=str(math.floor(100*(1-self.basic_status_yobi_2[17])))
        self.ids.calced_status_yobi_64.text=str(math.floor(100*(1-self.basic_status_yobi_2[18])))
        self.ids.calced_status_yobi_132.text=str(math.floor(100*(1-self.basic_status_yobi_2[37])))
        self.ids.calced_status_yobi_100.text=str(self.basic_status_yobi_2[20])
        self.ids.calced_status_yobi_101.text=str(self.basic_status_yobi_2[21])
        self.ids.calced_status_yobi_102.text=str(self.basic_status_yobi_2[22])
        self.ids.calced_status_yobi_103.text=str(self.basic_status_yobi_2[23])
        self.ids.calced_status_yobi_104.text=str(self.basic_status_yobi_2[24])
        self.ids.calced_status_yobi_105.text=str(self.basic_status_yobi_2[25])
        self.ids.calced_status_yobi_106.text=str(self.basic_status_yobi_2[26])
        self.ids.calced_status_yobi_114.text=str(self.basic_status_yobi_2[27])
        self.ids.calced_status_yobi_115.text=str(self.basic_status_yobi_2[28])
        self.ids.calced_status_yobi_116.text=str(self.basic_status_yobi_2[29])
        self.ids.calced_status_yobi_117.text=str(self.basic_status_yobi_2[30])
        self.ids.calced_status_yobi_118.text=str(self.basic_status_yobi_2[31])
        self.ids.calced_status_yobi_119.text=str(self.basic_status_yobi_2[32])
        self.ids.calced_status_yobi_120.text=str(self.basic_status_yobi_2[33])
        #属性弱点耐性 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル

#########################誰はや##################################################
class DarehayaTab(StackLayout):
    def __init__(self, root_widget=None, **kwargs):
        super(DarehayaTab, self).__init__(**kwargs)
        self.bind(on_kv_post=self._on_kv_post)

    def _on_kv_post(self, base_widget, root_widget):
    #モンスター選択
        self.ids.monster_dare.values= data.monster_lst
        self.ids.monster_2_dare.values= data.monster_lst
#########################誰はや##################################################

    def on_sositu_selection_dare(self,text):
        self.sositu_hosei_dare=Generate_Monster.sositu_selection(self.ids.sositu_dare.text)
        return self.sositu_hosei_dare

    def on_sositu_selection_2_dare(self, text):
        self.sositu_hosei_2_dare=Generate_Monster.sositu_selection(self.ids.sositu_2_dare.text)
        return self.sositu_hosei_2_dare

    def on_seikaku_selection_dare(self, text):
        self.seikaku_hosei_dare=Generate_Monster.seikaku_selection(self.ids.seikaku_dare.text)
        print("seikaku-wa",text,"hosei-wa",self.seikaku_hosei_dare)
        return self.seikaku_hosei_dare

    def on_seikaku_selection_2_dare(self, text):
        self.seikaku_hosei_2_dare=Generate_Monster.seikaku_selection(self.ids.seikaku_2_dare.text)
        #print("seikaku2-wa",text,"hosei2-wa",self.seikaku_hosei_2)
        return self.seikaku_hosei_2_dare

    def on_monster_selection_dare(self,text):
        self.basic_status_dare=Generate_Monster.monster_selection(self.ids.monster_dare.text)
        return self.basic_status_dare

    def on_monster_selection_2_dare(self,text):
        self.basic_status_2_dare=Generate_Monster.monster_selection(self.ids.monster_2_dare.text)
        return self.basic_status_2_dare
 
    def sosituseikaku_dare(self):
        if self.ids.sositu_dare.text=='素質':
            self.sositu_hosei_dare=1
        else:
            pass
        if self.ids.seikaku_dare.text=='性格':
            self.seikaku_hosei_dare=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster_dare.text=='モンスター':
            self.basic_status_dare=status.default_m
        else:
            pass

######味方すばやさ継承selection##########
    def on_ikkatu_selection(self,text):
        import re
        self.ikkatu_hosei=int(re.sub(r"\D", "", self.ids.ikkatu.text))
        print(self.ikkatu_hosei)

    def on_seityou_selection(self,text):
        import re
        self.seityou_hosei=int(re.sub(r"\D", "", self.ids.seityou.text))
        self.ids.goukei.text=str(int(re.sub(r"\D", "", self.ids.seityou.text))+int(re.sub(r"\D", "", self.ids.slot_1.text))+int(re.sub(r"\D", "", self.ids.slot_2.text))+int(re.sub(r"\D", "", self.ids.slot_3.text)))
        print(self.seityou_hosei)

    def on_slot_1_selection(self,text):
        import re
        self.slot_1_hosei=int(re.sub(r"\D", "", self.ids.slot_1.text))
        self.ids.goukei.text=str(int(re.sub(r"\D", "", self.ids.seityou.text))+int(re.sub(r"\D", "", self.ids.slot_1.text))+int(re.sub(r"\D", "", self.ids.slot_2.text))+int(re.sub(r"\D", "", self.ids.slot_3.text)))
        print(self.slot_1_hosei)
    def on_slot_2_selection(self,text):
        import re
        self.slot_2_hosei=int(re.sub(r"\D", "", self.ids.slot_2.text))
        self.ids.goukei.text=str(int(re.sub(r"\D", "", self.ids.seityou.text))+int(re.sub(r"\D", "", self.ids.slot_1.text))+int(re.sub(r"\D", "", self.ids.slot_2.text))+int(re.sub(r"\D", "", self.ids.slot_3.text)))
        print(self.slot_2_hosei)
    def on_slot_3_selection(self,text):
        import re
        self.slot_3_hosei=int(re.sub(r"\D", "", self.ids.slot_3.text))
        self.ids.goukei.text=str(int(re.sub(r"\D", "", self.ids.seityou.text))+int(re.sub(r"\D", "", self.ids.slot_1.text))+int(re.sub(r"\D", "", self.ids.slot_2.text))+int(re.sub(r"\D", "", self.ids.slot_3.text)))
        print(self.slot_3_hosei)

    def on_ikkatu_2_selection(self,text):
        import re
        self.ikkatu_2_hosei=int(re.sub(r"\D", "", self.ids.ikkatub.text))
        print(self.ikkatu_2_hosei)
    def on_seityoub_selection(self,text):
        import re
        self.seityoub_hosei=int(re.sub(r"\D", "", self.ids.seityoub.text))
        self.ids.goukei_2.text=str(int(re.sub(r"\D", "", self.ids.seityoub.text))+int(re.sub(r"\D", "", self.ids.slot_1b.text))+int(re.sub(r"\D", "", self.ids.slot_2b.text))+int(re.sub(r"\D", "", self.ids.slot_3b.text)))
        print(self.seityoub_hosei)

    def on_slot_1b_selection(self,text):
        import re
        self.slot_1b_hosei=int(re.sub(r"\D", "", self.ids.slot_1b.text))
        self.ids.goukei_2.text=str(int(re.sub(r"\D", "", self.ids.seityoub.text))+int(re.sub(r"\D", "", self.ids.slot_1b.text))+int(re.sub(r"\D", "", self.ids.slot_2b.text))+int(re.sub(r"\D", "", self.ids.slot_3b.text)))
        print(self.slot_1b_hosei)
    def on_slot_2b_selection(self,text):
        import re
        self.slot_2b_hosei=int(re.sub(r"\D", "", self.ids.slot_2b.text))
        self.ids.goukei_2.text=str(int(re.sub(r"\D", "", self.ids.seityoub.text))+int(re.sub(r"\D", "", self.ids.slot_1b.text))+int(re.sub(r"\D", "", self.ids.slot_2b.text))+int(re.sub(r"\D", "", self.ids.slot_3b.text)))
        print("hosei2B",self.slot_2b_hosei)
    def on_slot_3b_selection(self,text):
        import re
        self.slot_3b_hosei=int(re.sub(r"\D", "", self.ids.slot_3b.text))
        self.ids.goukei_2.text=str(int(re.sub(r"\D", "", self.ids.seityoub.text))+int(re.sub(r"\D", "", self.ids.slot_1b.text))+int(re.sub(r"\D", "", self.ids.slot_2b.text))+int(re.sub(r"\D", "", self.ids.slot_3b.text)))
        print(self.slot_3b_hosei)

#######################################

######敵すばやさ継承selection##########

    def on_zokusei_tai_selection_dare(self,text):
        import re
        self.zokusei_tai_hosei_dare=int(re.sub(r"\D", "", self.ids.zokusei_tai_dare.text))
        print(self.zokusei_tai_hosei_dare)

###########先制率計算##################


    def sensei(self):
#####agil初期化########
        if self.ids.monster_dare.text=='左or味方モンスター':
            self.agil_1=0
        else:
            pass
        if self.ids.monster_2_dare.text=='右or敵モンスター':
            self.agil_2=0
        else:
            pass
        if self.ids.bahu1.text=='0':
            self.bahu1_hosei=0
        else:
            pass
        if self.ids.bahu2.text=='0':
            self.bahu2_hosei=0
        else:
            pass

        import math
        # A_arrとB_arrをループで生成
        agil_1_factors = [1.00 + i * 0.01 for i in range(16)]
        agil_2_factors = [1.00 + i * 0.01 for i in range(16)]

        A_arr = [math.floor(int(self.agil_1) * factor) for factor in agil_1_factors]
        B_arr = [math.floor(int(self.agil_2) * factor) for factor in agil_2_factors]

        # nの計算を簡略化
        n = sum(sum(b <= a for b in B_arr) for a in A_arr) / (16 * 16)

        # 条件に応じてUIのテキストを更新
        if (self.ids.monster_dare.text == '左or味方モンスター') or (self.ids.monster_2_dare.text == '右or敵モンスター'):
            self.ids.calced_status_dare_32.text = ''
        else:
            self.ids.calced_status_dare_44.text = f"{round(n * 100, 2)}%"
            self.ids.calced_status_dare_32.text = f"{self.ids.monster_dare.text}の先制率"

##################################################

#######Reset#############
    def on_reset_press_dare(self,text):
        self.ids.monster_dare.text='左or味方モンスター'
        self.ids.sositu_dare.text='素質'
        self.ids.seikaku_dare.text='性格'
        self.ids.monster_2_dare.text='右or敵モンスター'
        self.ids.sositu_2_dare.text='素質'
        self.ids.seikaku_2_dare.text='性格'
        self.ids.ikkatu.text='0'
        self.ids.seityou.text='0'
        self.ids.slot_1.text='0'
        self.ids.slot_2.text='0'
        self.ids.slot_3.text='0'
        self.ids.ikkatub.text='0'
        self.ids.seityoub.text='0'
        self.ids.slot_1b.text='0'
        self.ids.slot_2b.text='0'
        self.ids.slot_3b.text='0'
        self.ids.bahu1.text='0'
        self.ids.bahu2.text='0'
        self.ids.calced_status_dare_32.text=''
        self.ids.calced_status_dare_44.text=''

        
#######################################
###攻撃モンスタselection######
    def sosituseikaku_dare(self):
        if self.ids.sositu_dare.text=='素質':
            self.sositu_hosei_dare=1
        else:
            pass
        if self.ids.seikaku_dare.text=='性格':
            self.seikaku_hosei_dare=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster_dare.text=='左or味方モンスター':
            self.basic_status_dare=status.default_m
        else:
            pass
        if self.ids.bahu1.text=='0':
            self.bahu1_hosei=0
        else:
            pass

        import math
        self.sosituseikaku_monster_dare = [
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[0]*self.basic_status_dare[0]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[1]*self.basic_status_dare[1]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[2]*self.basic_status_dare[2]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[3]*self.basic_status_dare[3]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[4]*self.basic_status_dare[4]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[5]*self.basic_status_dare[5]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[6]*self.basic_status_dare[6]),
            math.ceil(self.sositu_hosei_dare*self.seikaku_hosei_dare[7]*self.basic_status_dare[7]),
            self.basic_status_dare[8], self.basic_status_dare[9], self.basic_status_dare[10],
            self.basic_status_dare[11], self.basic_status_dare[12], self.basic_status_dare[13],
            self.basic_status_dare[14], self.basic_status_dare[15], self.basic_status_dare[16],
            self.basic_status_dare[17], self.basic_status_dare[18], self.basic_status_dare[19]
            ] 
        #print("final_status-wa",self.sosituseikaku_monster_dare)
        HP=str(self.sosituseikaku_monster_dare[0])
        MP=str(self.sosituseikaku_monster_dare[1])
        tikara=str(self.sosituseikaku_monster_dare[2])
        mamori=str(self.sosituseikaku_monster_dare[3])
        kouma=str(self.sosituseikaku_monster_dare[4])
        kaima=str(self.sosituseikaku_monster_dare[5])
        suba=str(self.sosituseikaku_monster_dare[6])
        kiyou=str(self.sosituseikaku_monster_dare[7])
###############初期値#####################
        if self.ids.ikkatu.text=='0':
            self.ikkatu_hosei='0'
        if self.ids.seityou.text=='0':
            self.seityou_hosei='0'
        if self.ids.slot_1.text=='0':
            self.slot_1_hosei='0'
        if self.ids.slot_2.text=='0':
            self.slot_2_hosei='0'
        if self.ids.slot_3.text=='0':
            self.slot_3_hosei='0'
######################################
        self.ids.calced_status_dare_4.text=str(int(suba))
        if self.ids.ikkatu_active.active:
            self.ids.calced_status_dare_6.text=str(int(int(suba)+int(self.ikkatu_hosei)))
            self.ids.suba_keibahu1.text=str(int(int(int(suba)+int(self.ikkatu_hosei))*float(10+2*self.bahu1_hosei)/10))
            self.agil_1=int(int(int(suba)+int(self.ikkatu_hosei))*float(10+2*self.bahu1_hosei)/10)
        else:
            self.ids.calced_status_dare_6.text=str(int((int(suba)+int(self.seityou_hosei)+int(self.slot_1_hosei)+int(self.slot_2_hosei)+int(self.slot_3_hosei))))
            self.ids.suba_keibahu1.text=str(int((int(suba)+int(self.seityou_hosei)+int(self.slot_1_hosei)+int(self.slot_2_hosei)+int(self.slot_3_hosei))*float(10+2*self.bahu1_hosei)/10))
            self.agil_1=int((int(suba)+int(self.seityou_hosei)+int(self.slot_1_hosei)+int(self.slot_2_hosei)+int(self.slot_3_hosei))*float(10+2*self.bahu1_hosei)/10)

###守備モンスタselection#####

    def sosituseikaku_2_dare(self):
        if self.ids.sositu_2_dare.text=='素質':
            self.sositu_hosei_2_dare=1
        else:
            pass
        if self.ids.seikaku_2_dare.text=='性格':
            self.seikaku_hosei_2_dare=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)#killer_machine
        else:
            pass

        if self.ids.monster_2_dare.text=='右or敵モンスター':
            self.basic_status_2_dare=status.default_m
        else:
            pass

        if self.ids.bahu2.text=='0':
            self.bahu2_hosei=0
        else:
            pass
        #print("素質",self.ids.sositu_2.text)
        #print("性格",self.ids.seikaku_2.text)
        #print("モンスター",self.ids.monster_2.text)
        #print(self.basic_status)
        import math
        self.sosituseikaku_monster_2_dare = [
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[0]*self.basic_status_2_dare[0]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[1]*self.basic_status_2_dare[1]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[2]*self.basic_status_2_dare[2]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[3]*self.basic_status_2_dare[3]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[4]*self.basic_status_2_dare[4]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[5]*self.basic_status_2_dare[5]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[6]*self.basic_status_2_dare[6]),
            math.ceil(self.sositu_hosei_2_dare*self.seikaku_hosei_2_dare[7]*self.basic_status_2_dare[7]),
            self.basic_status_2_dare[8], self.basic_status_2_dare[9], self.basic_status_2_dare[10],
            self.basic_status_2_dare[11], self.basic_status_2_dare[12], self.basic_status_2_dare[13],
            self.basic_status_2_dare[14], self.basic_status_2_dare[15], self.basic_status_2_dare[16],
            self.basic_status_2_dare[17], self.basic_status_2_dare[18], self.basic_status_2_dare[19]] 
        #print("final_status-wa",self.sosituseikaku_monster)
        HP=str(self.sosituseikaku_monster_2_dare[0])
        MP=str(self.sosituseikaku_monster_2_dare[1])
        tikara=str(self.sosituseikaku_monster_2_dare[2])
        mamori=str(self.sosituseikaku_monster_2_dare[3])
        kouma=str(self.sosituseikaku_monster_2_dare[4])
        kaima=str(self.sosituseikaku_monster_2_dare[5])
        suba2=str(self.sosituseikaku_monster_2_dare[6])
        kiyou=str(self.sosituseikaku_monster_2_dare[7])

 ###############初期値#####################
        if self.ids.ikkatub.text=='0':
            self.ikkatu_2_hosei='0'
        if self.ids.seityoub.text=='0':
            self.seityoub_hosei='0'
        if self.ids.slot_1b.text=='0':
            self.slot_1b_hosei='0'
        if self.ids.slot_2b.text=='0':
            self.slot_2b_hosei='0'
        if self.ids.slot_3b.text=='0':
            self.slot_3b_hosei='0'
######################################
        self.ids.calced_status_dare_54.text=str(int(suba2))
        import math
        if self.ids.ikkatu_active_2.active:
            self.ids.calced_status_dare_56.text=str(int((int(suba2)+int(self.ikkatu_2_hosei))))
            self.ids.suba_keibahu2.text=str(int((int(suba2)+int(self.ikkatu_2_hosei))*float(10+2*self.bahu2_hosei)/10))
            self.agil_2 = int((int(suba2)+int(self.ikkatu_2_hosei))*float(10+2*self.bahu2_hosei)/10)
        else:
            self.ids.calced_status_dare_56.text=str(int(int(int(suba2)+int(self.seityoub_hosei)+int(self.slot_1b_hosei)+int(self.slot_2b_hosei)+int(self.slot_3b_hosei))))
            self.ids.suba_keibahu2.text=str(int(int(int(suba2)+int(self.seityoub_hosei)+int(self.slot_1b_hosei)+int(self.slot_2b_hosei)+int(self.slot_3b_hosei))*float(10+2*self.bahu2_hosei)/10))
            self.agil_2 = int(int(int(suba2)+int(self.seityoub_hosei)+int(self.slot_1b_hosei)+int(self.slot_2b_hosei)+int(self.slot_3b_hosei))*float(10+2*self.bahu2_hosei)/10)

######バフselection##########

    def on_bahu1_selection(self,text):
        self.bahu1_hosei=int(self.ids.bahu1.text)
        print(self.bahu1_hosei)


    def on_bahu2_selection(self,text):
        self.bahu2_hosei=int(self.ids.bahu2.text)
        print(self.bahu2_hosei)

#########################ツーパン##################################################
class TwoPanTab(StackLayout):
    def open_twopan_popup(self):
        popup = TwopanPopup()
        popup.open()

class TwopanPopup(Popup):

    def __init__(self, **kwargs):
        from kivy.core.window import Window
        super().__init__(**kwargs)
        self.title = "ツーパン"

        # 解像度に依存しないサイズ調整
        popup_width = Window.width * 1.0  # 画面幅の80%をポップアップの幅に設定
        popup_height = Window.height * 0.95  # 画面高さの80%をポップアップの高さに設定
        self.size_hint = (None, None)
        self.size = (popup_width, popup_height)

        self.twopan_widget = None

        # ローディング用のレイアウト
        from kivy.uix.boxlayout import BoxLayout
        self.layout = BoxLayout(orientation='vertical')

        # GIF画像のローディング表示
        from kivy.uix.image import Image
        from kivy.resources import resource_find
        gif_source = resource_find('video/Loading_gif_2.gif')
        if gif_source:
            self.loading_image = Image(
                source=gif_source,
                size_hint=(None, None),
                size=(popup_width * 0.7, popup_height * 0.7),  # ポップアップのサイズに基づいてGIFサイズを調整
                pos_hint={'center_x': 0.5, 'center_y': 0.5},
                anim_delay=0.20,  # アニメーションの速度を設定
            )
        else:
            # GIFが見つからない場合はエラーメッセージを表示するなどの処理を追加
            self.loading_image = Image(
                source='path/to/default_image.png',  # 代わりの画像ファイル
                size_hint=(None, None),
                size=(popup_width * 0.9, popup_height * 0.9),  # 代替画像もサイズ調整
                pos_hint={'center_x': 0.5, 'center_y': 0.5},
            )

        # ローディング画像をレイアウトに追加
        self.layout.add_widget(self.loading_image)

        # レイアウトをポップアップのコンテンツとして設定
        self.add_widget(self.layout)

        # ポップアップが開かれたときにウィジェットを遅延ロードする
        self.bind(on_open=self.show_loading_and_load_twopan_widget)
    def show_loading_and_load_twopan_widget(self, *args):
        # ウィジェットを別スレッドでロード
        from threading import Thread
        thread = Thread(target=self.load_twopan_widget)
        thread.start()

    def load_twopan_widget(self):
        # ここで長時間かかる処理やデータの読み込みを行います
        import time
        time.sleep(1)  # ダミーの遅延

        # メインスレッドでUIを更新
        from kivy.clock import Clock
        Clock.schedule_once(self._on_load_complete)

    def _on_load_complete(self, *args):
        # ローディング画像をレイアウトから削除
        self.layout.remove_widget(self.loading_image)

        # TwoPanWidgetを作成し、レイアウトに追加
        self.twopan_widget = TwoPanWidget()
        self.layout.add_widget(self.twopan_widget)

        # TwoPanWidgetのデータを更新
        self.twopan_widget.update_data()
        




class TwoPanWidget(StackLayout):
    def __init__(self, **kwargs):
        # 1st parameters
        self.zokusei_hosei_two = 0
        self.zokuzen_hosei_two = 0
        self.keitou_hosei_two = 0
        self.kougeki_hosei_two = 0
        self.baiki_hosei_two = 0
        self.zokusei_tai_hosei_two = 0
        self.keitou_tai_hosei_two = 0
        self.syubi_hosei_two = 0
        self.zantaitai_hosei_two = 0
        self.jumontai_hosei_two = 0
        self.bretai_hosei_two = 0
        self.skala_hosei_two = 0
        self.kouma_hosei_two = 0
        self.kiyousa_hosei_two = 0

        # 2nd parameters (suffix _3)
        self.zokusei_hosei_two_3 = 0
        self.zokuzen_hosei_two_3 = 0
        self.keitou_hosei_two_3 = 0
        self.kougeki_hosei_two_3 = 0
        self.baiki_hosei_two_3 = 0
        self.zokusei_tai_hosei_two_3 = 0
        self.keitou_tai_hosei_two_3 = 0
        self.zantaitai_hosei_two_3 = 0
        self.jumontai_hosei_two_3 = 0
        self.bretai_hosei_two_3 = 0
        self.kouma_hosei_two_3 = 0
        self.kiyousa_hosei_two_3 = 0

        # Additional and helper parameters
        self.additional_HP = 0
        self.sositu_hosei_two = 1
        self.seikaku_hosei_two = (1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        self.basic_status_two = status.default_m
        self.sosituseikaku_monster_two = [0] * 20
        
        self.sositu_hosei_two_2 = 1
        self.seikaku_hosei_two_2 = (1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        self.basic_status_two_2 = status.default_m
        self.sosituseikaku_monster_two_2 = [0] * 20

        self.sositu_hosei_two_3 = 1
        self.seikaku_hosei_two_3 = (1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        self.basic_status_two_3 = status.default_m
        self.sosituseikaku_monster_two_3 = [0] * 20

        self.skill_buturi_tan_two = data.none
        self.skill_buturi_zen_two = data.none
        self.skill_buturi_tan_two_3 = data.none
        self.skill_buturi_zen_two_3 = data.none
        self.skill_jumon_two = data.none
        self.skill_breath_two = data.none
        self.skill_jumon_two_3 = data.none
        self.skill_breath_two_3 = data.none

        self.zokusei_hosei_two_tan = 0
        self.zokuzen_hosei_two_tan = 0
        self.zokusei_hosei_two_tan_3 = 0
        self.zokuzen_hosei_two_tan_3 = 0

        super(TwoPanWidget, self).__init__(**kwargs)

    def update_data(self):
        # データを設定する処理
        self.ids.monster_two.values = data.monster_lst
        self.ids.monster_two_2.values = data.monster_lst
        self.ids.monster_two_3.values = data.monster_lst
        self.ids.buturi_zen_two.values = data.skill_zen_lst
        self.ids.buturi_zen_two_3.values = data.skill_zen_lst
        self.ids.jumon_two.values = data.jumon_zen_lst
        self.ids.jumon_two_3.values = data.jumon_zen_lst
        self.ids.breath_two.values = data.jumon_tan_lst
        self.ids.breath_two_3.values = data.jumon_tan_lst
        self.ids.buturi_tan_two.values = data.skill_tan_lst
        self.ids.buturi_tan_two_3.values = data.skill_tan_lst
        # データを設定する処理
        # ここではUIを更新するコードを記述します
        pass
####################################################
#ダメージ関数（全体物理）
#################
#######挿入#################
    def monster_define_two(self):

        if self.ids.monster_two.text=='攻撃モンスター':
            self.basic_status_two=status.default_m
            power_two =self.basic_status_two[2]
            m_power_two=self.basic_status_two[4]
        else:
            power_two =self.sosituseikaku_monster_two[2]
            m_power_two=self.sosituseikaku_monster_two[4]
        if self.ids.monster_two_2.text=='守備モンスター':
            self.basic_status_two_2=status.default_m
            guard_two =self.basic_status_two_2[3]

        else:
            guard_two =self.sosituseikaku_monster_two_2[3]

        if self.ids.buturi_tan_two.text=='単体物理':
            self.skill_buturi_tan_two=data.none
            skill_mag_tan_two=self.skill_buturi_tan_two[0]
        else:
            skill_mag_tan_two=self.skill_buturi_tan_two[0]

        if self.ids.buturi_zen_two.text=='全体物理':
            self.skill_buturi_zen_two=data.none
            skill_mag_two=self.skill_buturi_zen_two[0]
        else:
            skill_mag_two=self.skill_buturi_zen_two[0]

        return power_two,m_power_two,guard_two,skill_mag_tan_two,skill_mag_two

    def hosei_syokika_two(self):
        import re
        hosei_ids = [
            ('zokusei_two', 'zokusei_hosei_two'),
            ('zokuzen_two', 'zokuzen_hosei_two'),
            ('keitou_two', 'keitou_hosei_two'),
            ('kougeki_two', 'kougeki_hosei_two'),
            ('baiki_two', 'baiki_hosei_two'),
            ('zokusei_tai_two', 'zokusei_tai_hosei_two'),
            ('keitou_tai_two', 'keitou_tai_hosei_two'),
            ('syubi_two', 'syubi_hosei_two', '守備力'),
            ('zantaitai_two', 'zantaitai_hosei_two'),
            ('jumontai_two', 'jumontai_hosei_two'),
            ('bretai_two', 'bretai_hosei_two'),
            ('skala_two', 'skala_hosei_two', 'スカラ'),
            ('kouma_two', 'kouma_hosei_two'),
            ('kiyousa_two', 'kiyousa_hosei_two')
        ]
        
        for hosei_info in hosei_ids:
            if len(hosei_info) == 3:
                attr_id, hosei_attr, default = hosei_info
                text = self.ids[attr_id].text
                if text == '0' or text == default:
                    setattr(self, hosei_attr, 0)
                else:
                    num_part = re.sub(r"\D", "", text)
                    setattr(self, hosei_attr, int(num_part) if num_part else 0)
            else:
                attr_id, hosei_attr = hosei_info
                text = self.ids[attr_id].text
                if text == '0':
                    setattr(self, hosei_attr, 0)
                else:
                    num_part = re.sub(r"\D", "", text)
                    setattr(self, hosei_attr, int(num_part) if num_part else 0)

        return (
            self.zokusei_hosei_two, self.zokuzen_hosei_two, self.keitou_hosei_two,
            self.kougeki_hosei_two, self.baiki_hosei_two, self.zokusei_tai_hosei_two,
            self.keitou_tai_hosei_two, self.syubi_hosei_two, self.zantaitai_hosei_two,
            self.jumontai_hosei_two, self.bretai_hosei_two, self.skala_hosei_two,
            self.kouma_hosei_two, self.kiyousa_hosei_two
        )

    def hosei_syokika_two_3(self):
        import re
        hosei_ids = [
            ('zokusei_two_3', 'zokusei_hosei_two_3'),
            ('zokuzen_two_3', 'zokuzen_hosei_two_3'),
            ('keitou_two_3', 'keitou_hosei_two_3'),
            ('kougeki_two_3', 'kougeki_hosei_two_3'),
            ('baiki_two_3', 'baiki_hosei_two_3'),
            ('zokusei_tai_two_3', 'zokusei_tai_hosei_two_3'),
            ('keitou_tai_two_3', 'keitou_tai_hosei_two_3'),
            ('syubi_two', 'syubi_hosei_two', '守備力'), # syubi and skala are shared? checking IDs later
            ('zantaitai_two_3', 'zantaitai_hosei_two_3'),
            ('jumontai_two_3', 'jumontai_hosei_two_3'),
            ('bretai_two_3', 'bretai_hosei_two_3'),
            ('skala_two', 'skala_hosei_two', 'スカラ'),
            ('kouma_two_3', 'kouma_hosei_two_3'),
            ('kiyousa_two_3', 'kiyousa_hosei_two_3')
        ]
        
        for hosei_info in hosei_ids:
            if len(hosei_info) == 3:
                attr_id, hosei_attr, default = hosei_info
                text = self.ids[attr_id].text
                if text == '0' or text == default:
                    setattr(self, hosei_attr, 0)
                else:
                    num_part = re.sub(r"\D", "", text)
                    setattr(self, hosei_attr, int(num_part) if num_part else 0)
            else:
                attr_id, hosei_attr = hosei_info
                text = self.ids[attr_id].text
                if text == '0':
                    setattr(self, hosei_attr, 0)
                else:
                    num_part = re.sub(r"\D", "", text)
                    setattr(self, hosei_attr, int(num_part) if num_part else 0)

        return (self.zokusei_hosei_two_3,
                self.zokuzen_hosei_two_3,
                self.keitou_hosei_two_3,
                self.kougeki_hosei_two_3,
                self.baiki_hosei_two_3,
                self.zokusei_tai_hosei_two_3,
                self.keitou_tai_hosei_two_3,
                self.syubi_hosei_two,
                self.zantaitai_hosei_two_3,
                self.jumontai_hosei_two_3,
                self.bretai_hosei_two_3,
                self.skala_hosei_two,
                self.kouma_hosei_two_3,
                self.kiyousa_hosei_two_3)

    def damage_phys_zen_two(self):
        power_two,m_power_two, guard_two,skill_mag_tan_two,skill_mag_two=self.monster_define_two()
        (self.zokusei_hosei_two,
                self.zokuzen_hosei_two,
                self.keitou_hosei_two,
                self.kougeki_hosei_two,
                self.baiki_hosei_two,
                self.zokusei_tai_hosei_two,
                self.keitou_tai_hosei_two,
                self.syubi_hosei_two,
                self.zantaitai_hosei_two,
                self.jumontai_hosei_two,
                self.bretai_hosei_two,
                self.skala_hosei_two,
                self.kouma_hosei_two,
                self.kiyousa_hosei_two)=self.hosei_syokika_two()    
        #print("スカラ",self.skala_hosei_two)
################################################

        if self.ids.force_two.text=='ドルマ' and self.skill_buturi_zen_two[6] == 10:#無属性=10
            zokusei_num_two = 18  #ドルマ=18
            self.zokusei_hosei_zen_two=self.zokusei_hosei_two/2
            self.zokuzen_hosei_zen_two=self.zokuzen_hosei_two/2
        else: 
            zokusei_num_two = self.skill_buturi_zen_two[6] #選択全体属性
            self.zokusei_hosei_zen_two=self.zokusei_hosei_two
            self.zokuzen_hosei_zen_two=self.zokuzen_hosei_two

        resist = self.basic_status_two_2[zokusei_num_two] #属性耐性

        additional_mag=1 #予備
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_two==18:
            additional_mag=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two = 1  # 
        if self.ids.kouryu_two.text == '+1':
            kouryu_mag_two = 1.2
        elif self.ids.kouryu_two.text == '+2':
            kouryu_mag_two = 1.4
        elif self.ids.kouryu_two.text == '+3':
            kouryu_mag_two = 1.6
        elif self.ids.kouryu_two.text == '+4':
            kouryu_mag_two = 1.8
        else:
            pass
    ######物理計算式########
        if self.ids.bousou_two.active:#会心
            if skill_mag_two<1:
                skill_mag_two=1
            else:
                pass

#########攻魔複合#(工事中)#######################################
        ################
        ################################################
        import math

        if self.skill_buturi_zen_two[1]=='hukugou': #攻魔複合なら
            power_two =math.floor(0.85*(power_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)) + math.floor(0.85*(m_power_two+self.kouma_hosei_two))
            print("power_two",power_two)
        elif self.skill_buturi_zen_two[1]=='koukai': #攻回複合なら
            kaima_two = status.default_m[5] if self.ids.monster_two.text == '攻撃モンスター' else self.sosituseikaku_monster_two[5]
            power_two =math.floor(0.50*(power_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)) + math.floor(1.30*(kaima_two + self.kouma_hosei_two))
            print("power_two",power_two)
        else:
            power_two=(power_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)
            m_power_two=m_power_two+self.kouma_hosei_two

        __,damage,damage_center,max_damage_zen_two,mini_damage_zen=CalcDamage.calc_damage_phys(
            power_two,self.kougeki_hosei_two,
            self.baiki_hosei_two,guard_two,
            self.syubi_hosei_two,
            self.skala_hosei_two,
            skill_mag_two,resist,
            self.zokusei_tai_hosei_two,
            self.zantaitai_hosei_two,
            self.keitou_tai_hosei_two,
            self.zokusei_hosei_two,
            self.zokuzen_hosei_two,
            self.keitou_hosei_two,
            additional_mag,
            kouryu_mag_two
            )


        import math
        if self.ids.bousou_two.active:        
            damage_center = math.floor(1.8*damage)
            max_damage_zen_two = math.floor(2*max_damage_zen_two)
            mini_damage_zen = math.floor(1.6*mini_damage_zen)


        if self.ids.buturi_zen_two.text == '全体物理':
            pass
        else:
            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_28.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_28.text=str('-')
      #     elif  self.ids.buturi_zen_two.text == '全体物理':
     #          self.ids.calced_status_two_28.text=str('-')
            elif  (damage_center <= 0) and  power_two>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_28.text=str('無効')
            elif power_two<1/2*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_28.text=str('<1/2')
            elif power_two<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_28.text=str('<4/7')
            else: 
                self.ids.calced_status_two_28.text=str(damage_center)

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_26.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_26.text=str('-')
     #   elif  self.ids.buturi_zen_two.text == '全体物理':
     #       self.ids.calced_status_two_26.text=str('-')
            elif  (mini_damage_zen <= 0) and  power_two>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_26.text=str('無効')
            elif power_two<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_26.text=str('-')
            else: 
                self.ids.calced_status_two_26.text=str(mini_damage_zen)

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_30.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_30.text=str('-')
      #     elif  self.ids.buturi_zen_two.text == '全体物理':
      #         self.ids.calced_status_two_30.text=str('-')
            elif  (max_damage_zen_two <= 0) and  power_two>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_30.text=str('無効')
            elif power_two<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_30.text=str('-')
            else: 
                self.ids.calced_status_two_30.text=str(max_damage_zen_two)


###########################################

#ダメージ関数（単体物理）
#属性耐性########

    def damage_phys_tan_two(self):
        power_two,m_power_two,guard_two,skill_mag_tan_two,skill_mag_two=self.monster_define_two()
        (self.zokusei_hosei_two,
                self.zokuzen_hosei_two,
                self.keitou_hosei_two,
                self.kougeki_hosei_two,
                self.baiki_hosei_two,
                self.zokusei_tai_hosei_two,
                self.keitou_tai_hosei_two,
                self.syubi_hosei_two,
                self.zantaitai_hosei_two,
                self.jumontai_hosei_two,
                self.bretai_hosei_two,
                self.skala_hosei_two,
                self.kouma_hosei_two,
                self.kiyousa_hosei_two)=self.hosei_syokika_two()  

        ##冥王(直撃)
        if self.ids.buturi_tan_two.text=='冥王(直撃)':
            guard_two = 0
            self.syubi_hosei_two=0

        if self.ids.force_two.text=='ドルマ' and self.skill_buturi_tan_two[6] == 10:#無属性=10
            zokusei_num_tan_two = 18  #ドルマ=18
            self.zokusei_hosei_two_tan=self.zokusei_hosei_two/2
            self.zokuzen_hosei_two_tan=self.zokuzen_hosei_two/2

        else: 
            zokusei_num_tan_two = self.skill_buturi_tan_two[6] #選択全体属性
            self.zokusei_hosei_two_tan=self.zokusei_hosei_two
            self.zokuzen_hosei_two_tan=self.zokuzen_hosei_two

        resist_tan = self.basic_status_two_2[zokusei_num_tan_two]

        additional_mag_tan=1
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_tan_two==18:
            additional_mag_tan=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two = 1  # 
        if self.ids.kouryu_two.text == '+1':
            kouryu_mag_two = 1.2
        elif self.ids.kouryu_two.text == '+2':
            kouryu_mag_two = 1.4
        elif self.ids.kouryu_two.text == '+3':
            kouryu_mag_two = 1.6
        elif self.ids.kouryu_two.text == '+4':
            kouryu_mag_two = 1.8
        else:
            pass
        if self.ids.bousou_two.active:
            if self.skill_buturi_tan_two[5]==5:#会心スキル（大暴れ）
                skill_mag_tan_two=1
            else:
                pass
        
#########攻魔複合#(工事中)#######################################
        ################
        ################################################
        import math

        if self.skill_buturi_tan_two[1]=='hukugou': #攻魔複合なら
            power_two =math.floor(0.85*(power_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)) + math.floor(0.85*(m_power_two+self.kouma_hosei_two))
            print("power_two",power_two)
        elif self.skill_buturi_tan_two[1]=='koukai': #攻回複合なら
            kaima_two = status.default_m[5] if self.ids.monster_two.text == '攻撃モンスター' else self.sosituseikaku_monster_two[5]
            power_two =math.floor(0.50*(power_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)) + math.floor(1.30*(kaima_two + self.kouma_hosei_two))
            print("power_two",power_two)
        else:
            power_two=(power_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)
            m_power_two=m_power_two+self.kouma_hosei_two

        __,damage_tan,damage_center_tan,max_damage_tan,mini_damage_tan=CalcDamage.calc_damage_phys(
            power_two,self.kougeki_hosei_two,
            self.baiki_hosei_two,guard_two,
            self.syubi_hosei_two,
            self.skala_hosei_two,
            skill_mag_tan_two,resist_tan,
            self.zokusei_tai_hosei_two,
            self.zantaitai_hosei_two,
            self.keitou_tai_hosei_two,
            self.zokusei_hosei_two,
            self.zokuzen_hosei_two,
            self.keitou_hosei_two,
            additional_mag_tan,
            kouryu_mag_two
            )

        import math
        #[5]大暴れ型5,物理単発6,1.6~2.0型7)
        if self.ids.bousou_two.active:        
            if self.skill_buturi_tan_two[5]==5:#会心スキル（大暴れ）
                damage_center_tan = math.floor(1.8*damage_tan)
                max_damage_tan = math.floor(2*max_damage_tan)
                mini_damage_tan = math.floor(1.6*mini_damage_tan)
            elif self.skill_buturi_tan_two[5]==7:#会心スキル（デスクロー）
                damage_center_tan = math.floor(1.8*damage_tan)
                max_damage_tan = math.floor(2*max_damage_tan)
                mini_damage_tan = math.floor(1.6*mini_damage_tan)
            elif  self.skill_buturi_tan_two[5]==6:#会心スキル（1.6 or kanstu）
                #貫通
                pre_basic_damage_two_tan_1 = math.floor(max(0, (power_two)))
                pre_damage_tan_1 = pre_basic_damage_two_tan_1*(resist_tan-self.zokusei_tai_hosei_two/100)*(additional_mag_tan)*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+math.floor(self.zokusei_hosei_two_tan+self.zokuzen_hosei_two_tan)/100)*(1+self.keitou_hosei_two/100)
                pre_damage_tan_1 = math.floor(pre_damage_tan_1)
                #ｘ1.6
                pre_basic_damage_two_tan_2 = math.floor(max(0, (power_two)/2 - ((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)/4)))
                pre_damage_tan_2 = pre_basic_damage_two_tan_2*1.6*skill_mag_tan_two*(resist_tan-self.zokusei_tai_hosei_two/100)*(additional_mag_tan)*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+math.floor(self.zokusei_hosei_two_tan+self.zokuzen_hosei_two_tan)/100)*(1+self.keitou_hosei_two/100)
                pre_damage_tan_2 = math.floor(pre_damage_tan_2)
                
                if pre_damage_tan_1>pre_damage_tan_2:
                    damage_tan = pre_damage_tan_1
                    max_damage_tan = math.floor((pre_basic_damage_two_tan_1+math.floor((pre_basic_damage_two_tan_1/16)+1))*(resist_tan-self.zokusei_tai_hosei_two/100)*(additional_mag_tan)*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+math.floor(self.zokusei_hosei_two_tan+self.zokuzen_hosei_two_tan)/100)*(1+self.keitou_hosei_two/100))
                    max_damage_tan = math.floor(max_damage_tan)
   
                    mini_damage_tan = math.floor((pre_basic_damage_two_tan_1-math.floor((pre_basic_damage_two_tan_1/16)+1))*(resist_tan-self.zokusei_tai_hosei_two/100)*(additional_mag_tan)*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+math.floor(self.zokusei_hosei_two_tan+self.zokuzen_hosei_two_tan)/100)*(1+self.keitou_hosei_two/100))
                    mini_damage_tan = math.floor(mini_damage_tan)
                 #   range_basic_damage_two_tan =math.floor((1+math.floor(pre_basic_damage_two_tan_1/16))*(resist_tan-self.zokusei_tai_hosei_two/100)*additional_mag*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+(self.zokusei_hosei_two+self.zokuzen_hosei_two)/100)*(1+self.keitou_hosei_two/100))

                elif pre_damage_tan_2>pre_damage_tan_1:
                    damage_tan = pre_damage_tan_2
                    max_damage_tan = math.floor((pre_basic_damage_two_tan_2+math.floor((pre_basic_damage_two_tan_2/16)+1))*1.6*skill_mag_tan_two*(resist_tan-self.zokusei_tai_hosei_two/100)*(additional_mag_tan)*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+math.floor(self.zokusei_hosei_two_tan+self.zokuzen_hosei_two_tan)/100)*(1+self.keitou_hosei_two/100))
                    max_damage_tan = math.floor(max_damage_tan)
   
                    mini_damage_tan = math.floor((pre_basic_damage_two_tan_2-math.floor((pre_basic_damage_two_tan_2/16)+1))*1.6*skill_mag_tan_two*(resist_tan-self.zokusei_tai_hosei_two/100)*(additional_mag_tan)*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+math.floor(self.zokusei_hosei_two_tan+self.zokuzen_hosei_two_tan)/100)*(1+self.keitou_hosei_two/100))
                    mini_damage_tan = math.floor(mini_damage_tan)
                #    range_basic_damage_two_tan =math.floor((1+math.floor(pre_basic_damage_two_tan_2/16))*1.6*skill_mag_tan_two*(resist_tan-self.zokusei_tai_hosei_two/100)*additional_mag*(1-self.zantaitai_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1+(self.zokusei_hosei_two+self.zokuzen_hosei_two)/100)*(1+self.keitou_hosei_two/100))
                damage_center_tan=damage_tan


            else:
                pass


        if self.ids.buturi_tan_two.text == '単体物理':
            pass
        else:
            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_28.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_28.text=str('-')
            elif  (damage_center_tan <= 0) and power_two>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_28.text=str('無効')
            elif power_two<1/2*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_28.text=str('<1/2')
            elif power_two<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_28.text=str('<4/7')
            elif self.ids.bousou_two.active and self.skill_buturi_tan_two[5]==8:
                self.ids.calced_status_two_28.text='Select x1 skill'
            else: 
                self.ids.calced_status_two_28.text=str(damage_center_tan)

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_26.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_26.text=str('-')
            elif  mini_damage_tan <= 0 and power_two>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_26.text=str('-')
            elif power_two<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_26.text=str('-')
            elif self.ids.bousou_two.active and self.skill_buturi_tan_two[5]==8:
                self.ids.calced_status_two_26.text='-'
            else: 
                self.ids.calced_status_two_26.text=str(mini_damage_tan)

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_30.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_30.text=str('-')
            elif  max_damage_tan <= 0 and power_two>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_30.text=str('-')
            elif power_two<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_30.text=str('-')
            elif self.ids.bousou_two.active and self.skill_buturi_tan_two[5]==8:
                self.ids.calced_status_two_30.text='-'
            else: 
                self.ids.calced_status_two_30.text=str(max_damage_tan)

###########################################

#呪文ダメージ関数

    def jumon_damage_two(self): #（呪文）
        if self.ids.monster_two.text=='攻撃モンスター':
            self.basic_status_two=status.default_m
            m_power_int_two =self.basic_status_two[4]
            k_power_int_two =self.basic_status_two[5]
            power_int_two =self.basic_status_two[2]
            kiyousa_int =self.basic_status_two[7]
        else:
            m_power_int_two =self.sosituseikaku_monster_two[4]
            k_power_int_two =self.sosituseikaku_monster_two[5]
            power_int_two =self.sosituseikaku_monster_two[2]
            kiyousa_int =self.sosituseikaku_monster_two[7]

        if self.ids.jumon_two.text=='全・呪ブ':
            self.skill_jumon_two=data.none
            mini_mpower_int_two = self.skill_jumon_two[0] #最低魔力
            mini_power_int_two = self.skill_jumon_two[1] #最低威力
            max_mpower_int_two = self.skill_jumon_two[2] #最高魔力
            max_power_int_two = self.skill_jumon_two[3] #最高威力
            mini_mpower_bint_two = self.skill_jumon_two[0] #最低魔力
            mini_power_bint_two = self.skill_jumon_two[1] #最低威力
            max_mpower_bint_two = self.skill_jumon_two[2] #最高魔力
            max_power_bint_two = self.skill_jumon_two[3] #最高威力
        elif self.skill_jumon_two[5]== 1: #呪文
            mini_mpower_int_two = self.skill_jumon_two[0] #最低魔力
            mini_power_int_two = self.skill_jumon_two[1] #最低威力
            max_mpower_int_two = self.skill_jumon_two[2] #最高魔力
            max_power_int_two = self.skill_jumon_two[3] #最高威力
        elif self.skill_jumon_two[5]==3: #回復
            mini_mpower_int_two = self.skill_jumon_two[0] #最低魔力
            mini_power_int_two = self.skill_jumon_two[1] #最低威力
            max_mpower_int_two = self.skill_jumon_two[2] #最高魔力
            max_power_int_two = self.skill_jumon_two[3] #最高威力
        elif self.skill_jumon_two[5]==2: #ブレス
            mini_mpower_bint_two = self.skill_jumon_two[0] #最低魔力
            mini_power_bint_two = self.skill_jumon_two[1] #最低威力
            max_mpower_bint_two = self.skill_jumon_two[2] #最高魔力
            max_power_bint_two = self.skill_jumon_two[3] #最高威力
        #初期値
        if self.ids.zokusei_two.text=='0':
            self.zokusei_hosei_two=0
        else:
            pass
        if self.ids.zokuzen_two.text=='0':
            self.zokuzen_hosei_two=0
        else:
            pass
        if self.ids.keitou_two.text=='0':
            self.keitou_hosei_two=0
        else:
            pass
        if self.ids.kougeki_two.text=='0':
            self.kougeki_hosei_two=0
        else:
            pass
        if self.ids.kouma_two.text=='0':
            self.kouma_hosei_two=0
        else:
            pass
        if self.ids.kiyousa_two.text=='0':
            self.kiyousa_hosei_two=0
        else:
            pass
        if self.ids.zokusei_tai_two.text=='0':
            self.zokusei_tai_hosei_two=0
        else:
            pass
        if self.ids.keitou_tai_two.text=='0':
            self.keitou_tai_hosei_two=0
        else:
            pass

        if self.ids.jumontai_two.text=='0':
            self.jumontai_hosei_two=0
        else:
            pass
        if self.ids.bretai_two.text=='0':
            self.bretai_hosei_two=0
        else:
            pass
        if self.ids.baiki_two.text=='0':
            self.baiki_hosei_two=0
        else:
            pass

        if self.ids.skala_two.text=='0':
            self.skala_hosei_two=0
        else:
            pass
        zokusei_num_jumon_two = self.skill_jumon_two[6] #選択呪文属性
        resist_jumon = self.basic_status_two_2[zokusei_num_jumon_two] #属性耐性
        zokusei_num_breath_two = self.skill_jumon_two[6] #選択ブレス属性
        resist_breath = self.basic_status_two_2[zokusei_num_breath_two]#属性耐性
        #additional_mag=1  #予備
        additional_mag_jumon=1
        additional_mag_breath=1
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_jumon_two==18:
            additional_mag_jumon=0.8
        else:
            pass
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_breath_two==18:
            additional_mag_breath=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two = 1  # 
        if self.ids.kouryu_two.text == '+1':
            kouryu_mag_two = 1.2
        elif self.ids.kouryu_two.text == '+2':
            kouryu_mag_two = 1.4
        elif self.ids.kouryu_two.text == '+3':
            kouryu_mag_two = 1.6
        elif self.ids.kouryu_two.text == '+4':
            kouryu_mag_two = 1.8
        else:
            pass
########呪文＆ブレス計算式(全体用)############

        if self.skill_jumon_two[5]==1: #呪文
            __, damage_jumon, max_basic_damage_two_m, mini_basic_damage_two_m, max_damage_jumon, mini_damage_jumon=CalcDamage.damage_jumon(
                mini_power_int_two,
                m_power_int_two,
                self.kouma_hosei_two,
                mini_mpower_int_two,
                max_power_int_two,
                max_mpower_int_two,
                resist_jumon,
                self.zokusei_tai_hosei_two,
                additional_mag_jumon,
                self.zokusei_hosei_two,
                self.zokuzen_hosei_two,
                self.keitou_hosei_two,
                self.keitou_tai_hosei_two,
                self.jumontai_hosei_two,
                self.keitou_tai_hosei_two,
                kouryu_mag_two
                )

        elif self.skill_jumon_two[5]==3: #回復呪文
            __, damage_jumon, max_basic_damage_two_m, mini_basic_damage_two_m, max_damage_jumon, mini_damage_jumon=CalcDamage.damage_jumon(
                mini_power_int_two,
                k_power_int_two,
                self.kouma_hosei_two,
                mini_mpower_int_two,
                max_power_int_two,
                max_mpower_int_two,
                resist_jumon,
                self.zokusei_tai_hosei_two,
                additional_mag_jumon,
                self.zokusei_hosei_two,
                self.zokuzen_hosei_two,
                self.keitou_hosei_two,
                self.keitou_tai_hosei_two,
                self.jumontai_hosei_two,
                self.keitou_tai_hosei_two,
                kouryu_mag_two,
                True
                )

        elif self.skill_jumon_two[5]==2: #ブレス
            basic_damage_two_b = (mini_power_bint_two + ((power_int_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)+kiyousa_int+self.kiyousa_hosei_two - mini_mpower_bint_two) * (max_power_bint_two - mini_power_bint_two) / (max_mpower_bint_two - mini_mpower_bint_two))
            import math
            basic_damage_two_b=math.floor(basic_damage_two_b)
            damage_breath = basic_damage_two_b*(resist_breath-self.zokusei_tai_hosei_two/100)*additional_mag_breath*kouryu_mag_two*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.bretai_hosei_two/100)

            damage_breath = math.floor(damage_breath)
            max_basic_damage_two_b = basic_damage_two_b+math.floor(0.06*basic_damage_two_b)
            mini_basic_damage_two_b = basic_damage_two_b-math.floor(0.06*basic_damage_two_b)
            max_damage_breath = max_basic_damage_two_b*(resist_breath-self.zokusei_tai_hosei_two/100)*additional_mag_breath*kouryu_mag_two*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.bretai_hosei_two/100)
            max_damage_breath =  math.floor(max_damage_breath)
            mini_damage_breath = mini_basic_damage_two_b*(resist_breath-self.zokusei_tai_hosei_two/100)*additional_mag_breath*kouryu_mag_two*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.bretai_hosei_two/100)
            mini_damage_breath =  math.floor(mini_damage_breath)
        
        if self.skill_jumon_two[5]==1:#呪文暴走
            if self.ids.bousou_two.active:
                import math
                max_basic_damage_two_m = math.floor(2.0*max_basic_damage_two_m)
                max_damage_jumon = max_basic_damage_two_m*(resist_jumon-self.zokusei_tai_hosei_two/100)*additional_mag_jumon*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.jumontai_hosei_two/100)
                max_damage_jumon =  math.floor(max_damage_jumon)
                mini_basic_damage_two_m = math.floor(1.5*mini_basic_damage_two_m)
                mini_damage_jumon = mini_basic_damage_two_m*(resist_jumon-self.zokusei_tai_hosei_two/100)*additional_mag_jumon*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.jumontai_hosei_two/100)
                mini_damage_jumon =  math.floor(mini_damage_jumon)
                damage_jumon = math.floor((max_damage_jumon+mini_damage_jumon)/2)
            else:
                pass
        elif self.skill_jumon_two[5]==3:#回復暴走
            if self.ids.bousou_two.active:
                import math
                max_basic_damage_two_m = math.floor(2.0*max_basic_damage_two_m)
                max_damage_jumon = max_basic_damage_two_m*(1+self.zokusei_hosei_two/100)*(1+self.zokuzen_hosei_two/100)
                max_damage_jumon =  math.floor(max_damage_jumon)
                mini_basic_damage_two_m = math.floor(1.5*mini_basic_damage_two_m)
                mini_damage_jumon = mini_basic_damage_two_m*(1+self.zokusei_hosei_two/100)*(1+self.zokuzen_hosei_two/100)
                mini_damage_jumon =  math.floor(mini_damage_jumon)
                damage_jumon = math.floor((max_damage_jumon+mini_damage_jumon)/2)
            else:
                pass
        else:
            pass
######初期値##########
        if  self.ids.jumon_two.text == '全・呪ブ':
            pass
        else:
            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_28.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_jumon_two[5]!= 3:
                self.ids.calced_status_two_28.text=str('-')
            elif  self.ids.jumon_two.text == '全・呪ブ':
                self.ids.calced_status_two_28.text=str('-')
            elif self.skill_jumon_two[5]==1 and damage_jumon<0: #呪文0
                self.ids.calced_status_two_28.text=str(0)
            elif self.skill_jumon_two[5]==1: #呪文
                self.ids.calced_status_two_28.text=str(damage_jumon)
            elif self.skill_jumon_two[5]==3: #回復
                self.ids.calced_status_two_28.text=str(damage_jumon)
            elif self.skill_jumon_two[5]==2 and damage_breath<0: #ブレス0
                self.ids.calced_status_two_28.text=str(0)
            elif self.skill_jumon_two[5]==2: #ブレス
                self.ids.calced_status_two_28.text=str(damage_breath)

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_26.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_jumon_two[5]!= 3:
                self.ids.calced_status_two_26.text=str('-')
            elif  self.ids.jumon_two.text == '全・呪ブ':
                self.ids.calced_status_two_26.text=str('-')
            elif self.skill_jumon_two[5]==1 and mini_damage_jumon<0: #呪文0
                self.ids.calced_status_two_26.text=str(0)
            elif self.skill_jumon_two[5]==1: #呪文
                self.ids.calced_status_two_26.text=str(mini_damage_jumon)
            elif self.skill_jumon_two[5]==3: #回復
                self.ids.calced_status_two_26.text=str(mini_damage_jumon)
            elif self.skill_jumon_two[5]==2 and mini_damage_breath<0: #ブレス0
                self.ids.calced_status_two_26.text=str(0)
            elif self.skill_jumon_two[5]==2: #ブレス
                self.ids.calced_status_two_26.text=str(mini_damage_breath)    

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_30.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_jumon_two[5]!= 3:
                self.ids.calced_status_two_30.text=str('-')
            elif  self.ids.jumon_two.text == '全・呪ブ':
                self.ids.calced_status_two_30.text=str('-')
            elif self.skill_jumon_two[5]==1 and max_damage_jumon<0: #呪文0
                self.ids.calced_status_two_30.text=str(0)
            elif self.skill_jumon_two[5]==1: #呪文
                self.ids.calced_status_two_30.text=str(max_damage_jumon)
            elif self.skill_jumon_two[5]==3: #回復
                self.ids.calced_status_two_30.text=str(max_damage_jumon)
            elif self.skill_jumon_two[5]==2 and max_damage_breath<0: #ブレス0
                self.ids.calced_status_two_30.text=str(0)
            elif self.skill_jumon_two[5]==2: #ブレス
                self.ids.calced_status_two_30.text=str(max_damage_breath)


#########################################


#単体呪文ブレスダメージ関数
    def breath_damage_two(self): #基礎威力関数（呪文ブレス）
        if self.ids.monster_two.text=='攻撃モンスター':
            self.basic_status_two=status.default_m
            m_power_int_two =self.basic_status_two[4]
            k_power_int_two =self.basic_status_two[5]
            power_int_two =self.basic_status_two[2]
            kiyousa_int =self.basic_status_two[7]
        else:
            m_power_int_two =self.sosituseikaku_monster_two[4]
            power_int_two =self.sosituseikaku_monster_two[2]
            kiyousa_int =self.sosituseikaku_monster_two[7]
            k_power_int_two =self.sosituseikaku_monster_two[5]
 
        if self.ids.breath_two.text=='単・呪ブ':
            self.skill_breath_two=data.none
            mini_mpower_int_two_2 = self.skill_breath_two[0] #最低魔力
            mini_power_int_two_2 = self.skill_breath_two[1] #最低威力
            max_mpower_int_two_2 = self.skill_breath_two[2] #最高魔力
            max_power_int_two_2 = self.skill_breath_two[3] #最高威力
            mini_mpower_bint_two_2 = self.skill_breath_two[0] #最低魔力
            mini_power_bint_two_2 = self.skill_breath_two[1] #最低威力
            max_mpower_bint_two_2 = self.skill_breath_two[2] #最高魔力
            max_power_bint_two_2 = self.skill_breath_two[3] #最高威力
        elif self.skill_breath_two[5]==1: #呪文
            mini_mpower_int_two_2 = self.skill_breath_two[0] #最低魔力
            mini_power_int_two_2 = self.skill_breath_two[1] #最低威力
            max_mpower_int_two_2 = self.skill_breath_two[2] #最高魔力
            max_power_int_two_2 = self.skill_breath_two[3] #最高威力
        elif self.skill_breath_two[5]==3: #回復
            mini_mpower_int_two_2 = self.skill_breath_two[0] #最低魔力
            mini_power_int_two_2 = self.skill_breath_two[1] #最低威力
            max_mpower_int_two_2 = self.skill_breath_two[2] #最高魔力
            max_power_int_two_2 = self.skill_breath_two[3] #最高威力
        elif self.skill_breath_two[5]==2: #ブレス
            mini_mpower_bint_two_2 = self.skill_breath_two[0] #最低魔力
            mini_power_bint_two_2 = self.skill_breath_two[1] #最低威力
            max_mpower_bint_two_2 = self.skill_breath_two[2] #最高魔力
            max_power_bint_two_2 = self.skill_breath_two[3] #最高威力
    ###初期値設定####
        if self.ids.zokusei_two.text=='0':
            self.zokusei_hosei_two=0
        else:
            pass
        if self.ids.zokuzen_two.text=='0':
            self.zokuzen_hosei_two=0
        else:
            pass
        if self.ids.keitou_two.text=='0':
            self.keitou_hosei_two=0
        else:
            pass
        if self.ids.kouma_two.text=='0':
            self.kouma_hosei_two=0
        else:
            pass
        if self.ids.kiyousa_two.text=='0':
            self.kiyousa_hosei_two=0
        else:
            pass
        if self.ids.zokusei_tai_two.text=='0':
            self.zokusei_tai_hosei_two=0
        else:
            pass
        if self.ids.keitou_tai_two.text=='0':
            self.keitou_tai_hosei_two=0
        else:
            pass

        if self.ids.jumontai_two.text=='0':
            self.jumontai_hosei_two=0
        else:
            pass
        if self.ids.bretai_two.text=='0':
            self.bretai_hosei_two=0
        else:
            pass
        if self.ids.baiki_two.text=='0':
            self.baiki_hosei_two=0
        else:
            pass

        if self.ids.skala_two.text=='0':
            self.skala_hosei_two=0
        else:
            pass
        if self.ids.kougeki_two.text=='0':
            self.kougeki_hosei_two=0
        else:
            pass
        zokusei_num_breath_two_2 = self.skill_breath_two[6] #選択呪文属性
        resist_jumon_tan = self.basic_status_two_2[zokusei_num_breath_two_2] #属性耐性
        zokusei_num_breath_two = self.skill_breath_two[6] #選択ブレス属性
        resist_breath_tan = self.basic_status_two_2[zokusei_num_breath_two]#属性耐性
        additional_mag_jumon_tan=1
        additional_mag_breath_tan=1
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_breath_two_2==18:
            additional_mag_jumon_tan=0.8
        else:
            pass

        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_breath_two==18:
            additional_mag_breath_tan=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two = 1  # 
        if self.ids.kouryu_two.text == '+1':
            kouryu_mag_two = 1.2
        elif self.ids.kouryu_two.text == '+2':
            kouryu_mag_two = 1.4
        elif self.ids.kouryu_two.text == '+3':
            kouryu_mag_two = 1.6
        elif self.ids.kouryu_two.text == '+4':
            kouryu_mag_two = 1.8
        else:
            pass

#########呪文＆ブレス計算式(単体用)##########

        if self.skill_breath_two[5]==1: #呪文
            __, damage_jumon2, max_basic_damage_two_m2, mini_basic_damage_two_m2, max_damage_jumon2, mini_damage_jumon2=CalcDamage.damage_jumon(
                mini_power_int_two_2,
                m_power_int_two,
                self.kouma_hosei_two,
                mini_mpower_int_two_2,
                max_power_int_two_2,
                max_mpower_int_two_2,
                resist_jumon_tan,
                self.zokusei_tai_hosei_two,
                additional_mag_jumon_tan,
                self.zokusei_hosei_two,
                self.zokuzen_hosei_two,
                self.keitou_hosei_two,
                self.keitou_tai_hosei_two,
                self.jumontai_hosei_two,
                self.keitou_tai_hosei_two,
                kouryu_mag_two
                )

        elif self.skill_breath_two[5]==3: #回復
            __, damage_jumon2, max_basic_damage_two_b2, mini_basic_damage_two_b2, max_damage_jumon2, mini_damage_jumon2=CalcDamage.damage_jumon(
                mini_power_int_two_2,
                k_power_int_two,
                self.kouma_hosei_two,
                mini_mpower_int_two_2,
                max_power_int_two_2,
                max_mpower_int_two_2,
                resist_jumon_tan,
                self.zokusei_tai_hosei_two,
                additional_mag_jumon_tan,
                self.zokusei_hosei_two,
                self.zokuzen_hosei_two,
                self.keitou_hosei_two,
                self.keitou_tai_hosei_two,
                self.jumontai_hosei_two,
                self.keitou_tai_hosei_two,
                kouryu_mag_two,
                True
                )

        elif self.skill_breath_two[5]==2: #ブレス
            basic_damage_two_b2 = (mini_power_bint_two_2 + ((power_int_two+self.kougeki_hosei_two)*(1+0.2*self.baiki_hosei_two)+kiyousa_int+self.kiyousa_hosei_two - mini_mpower_bint_two_2) * (max_power_bint_two_2 - mini_power_bint_two_2) / (max_mpower_bint_two_2 - mini_mpower_bint_two_2))
            import math
            basic_damage_two_b2=math.floor(basic_damage_two_b2)
            damage_breath2 = basic_damage_two_b2*(resist_breath_tan-self.zokusei_tai_hosei_two/100)*additional_mag_breath_tan*kouryu_mag_two*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.bretai_hosei_two/100)

            damage_breath2 = math.floor(damage_breath2)
            max_basic_damage_two_b2 = basic_damage_two_b2+math.floor(0.06*basic_damage_two_b2)
            mini_basic_damage_two_b2 = basic_damage_two_b2-math.floor(0.06*basic_damage_two_b2)
            max_damage_breath2 = max_basic_damage_two_b2*(resist_breath_tan-self.zokusei_tai_hosei_two/100)*additional_mag_breath_tan*kouryu_mag_two*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.bretai_hosei_two/100)
            max_damage_breath2 =  math.floor(max_damage_breath2)
            mini_damage_breath2 = mini_basic_damage_two_b2*(resist_breath_tan-self.zokusei_tai_hosei_two/100)*additional_mag_breath_tan*kouryu_mag_two*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.bretai_hosei_two/100)
            mini_damage_breath2 =  math.floor(mini_damage_breath2)

        if self.skill_breath_two[5]== 1 : #呪文暴走
            if  self.ids.bousou_two.active:
                import math
                max_basic_damage_two_m2 = math.floor(2.0*max_basic_damage_two_m2)
                max_damage_jumon2 = max_basic_damage_two_m2*(resist_jumon_tan-self.zokusei_tai_hosei_two/100)*additional_mag_jumon_tan*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.jumontai_hosei_two/100)
                max_damage_jumon2 =  math.floor(max_damage_jumon2)

                mini_basic_damage_two_m2 = math.floor(1.5*mini_basic_damage_two_m2)
                mini_damage_jumon2 = mini_basic_damage_two_m2*(resist_jumon_tan-self.zokusei_tai_hosei_two/100)*additional_mag_jumon_tan*(1+self.zokusei_hosei_two/100+self.zokuzen_hosei_two/100)*(1+self.keitou_hosei_two/100)*(1-self.keitou_tai_hosei_two/100)*(1-self.jumontai_hosei_two/100)
                mini_damage_jumon2 =  math.floor(mini_damage_jumon2)
                damage_jumon2 = (max_damage_jumon2+mini_damage_jumon2)/2
            else:
                pass
        elif self.skill_breath_two[5]== 3 : #回復暴走
            if  self.ids.bousou_two.active:
                import math
                max_basic_damage_two_2 = math.floor(2.0*max_basic_damage_two_2)
                max_damage_jumon2 = max_basic_damage_two_2*(1+self.zokusei_hosei_two/100)*(1+self.zokuzen_hosei_two/100)
                max_damage_jumon2 =  math.floor(max_damage_jumon2)

                mini_basic_damage_two_2 = math.floor(1.5*mini_basic_damage_two_2)
                mini_damage_jumon2 = mini_basic_damage_two_2*(1+self.zokusei_hosei_two/100)*(1+self.zokuzen_hosei_two/100)
                mini_damage_jumon2 =  math.floor(mini_damage_jumon2)
                damage_jumon2 = (max_damage_jumon2+mini_damage_jumon2)/2
            else:
                pass                
                
        else:
            pass
######初期値##########
        if  self.ids.breath_two.text == '単・呪ブ':
            pass
        else:
            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_28.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_breath_two[5]!=3:
                self.ids.calced_status_two_28.text=str('-')
            elif  self.ids.breath_two.text == '単・呪ブ':
                self.ids.calced_status_two_28.text=str('-')
            elif self.skill_breath_two[5]==1 and damage_jumon2<0: #呪文0
                self.ids.calced_status_two_28.text=str(0)
            elif self.skill_breath_two[5]==1: #呪文
                self.ids.calced_status_two_28.text=str(damage_jumon2)
            elif self.skill_breath_two[5]==3: #回復
                self.ids.calced_status_two_28.text=str(damage_jumon2)
            elif self.skill_breath_two[5]==2 and damage_breath2<0: #ブレス0
                self.ids.calced_status_two_28.text=str(0)
            elif self.skill_breath_two[5]==2: #ブレス
                self.ids.calced_status_two_28.text=str(damage_breath2)

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_26.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_breath_two[5]!=3:
                self.ids.calced_status_two_26.text=str('-')
            elif  self.ids.breath_two.text == '単・呪ブ':
                self.ids.calced_status_two_26.text=str('-')
            elif self.skill_breath_two[5]==1 and mini_damage_jumon2<0: #呪文0
                self.ids.calced_status_two_26.text=str(0)
            elif self.skill_breath_two[5]==1: #呪文
                self.ids.calced_status_two_26.text=str(mini_damage_jumon2)
            elif self.skill_breath_two[5]==3: #回復
                self.ids.calced_status_two_26.text=str(mini_damage_jumon2)
            elif self.skill_breath_two[5]==2 and mini_damage_breath2<0: #ブレス0
                self.ids.calced_status_two_26.text=str(0)
            elif self.skill_breath_two[5]==2: #ブレス
                self.ids.calced_status_two_26.text=str(mini_damage_breath2)    

            if self.ids.monster_two.text == '攻撃モンスター':
                self.ids.calced_status_two_30.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_breath_two[5]!=3:
                self.ids.calced_status_two_30.text=str('-')
            elif  self.ids.breath_two.text == '単・呪ブ':
                self.ids.calced_status_two_30.text=str('-')
            elif self.skill_breath_two[5]==1 and max_damage_jumon2<0: #呪文0
                self.ids.calced_status_two_30.text=str(0)
            elif self.skill_breath_two[5]==1: #呪文
                self.ids.calced_status_two_30.text=str(max_damage_jumon2)
            elif self.skill_breath_two[5]==3: #回復
                self.ids.calced_status_two_30.text=str(max_damage_jumon2)
            elif self.skill_breath_two[5]==2 and max_damage_breath2<0: #ブレス0
                self.ids.calced_status_two_30.text=str(0)
            elif self.skill_breath_two[5]==2: #ブレス
                self.ids.calced_status_two_30.text=str(max_damage_breath2)

##################################################################################
#################################攻撃モンスター二匹目用　#######################################
#ダメージ関数（全体物理）
    def damage_phys_zen_two_3(self):
        '''power_two_3,m_power_two_3,guard_two,skill_mag_two_3,skill_mag_two_3=self.monster_define_two()
        (self.zokusei_hosei_two_3,
                self.zokuzen_hosei_two_3,
                self.keitou_hosei_two_3,
                self.kougeki_hosei_two_3,
                self.baiki_hosei_two_3,
                self.zokusei_tai_hosei_two_3,
                self.keitou_tai_hosei_two_3,
                self.syubi_hosei_two_3,
                self.zantaitai_hosei_two_3,
                self.jumontai_hosei_two_3,
                self.bretai_hosei_two_3,
                self.skala_hosei_two_3,
                self.kouma_hosei_two_3,
                self.kiyousa_hosei_two_3)=self.hosei_syokika_two()  
          
        if self.ids.force_two_3.text=='ドルマ' and self.skill_buturi_zen_two_3[6] == 10:#無属性=10
            zokusei_num_zen_two_3 = 18  #ドルマ=18
            self.zokusei_hosei_two_tan_3=self.zokusei_hosei_two_3/2
            self.zokuzen_hosei_two_tan_3=self.zokuzen_hosei_two_3/2

        else: 
            zokusei_num_zen_two_3 = self.skill_buturi_zen_two_3[6] #選択全体属性
            self.zokusei_hosei_two_tan_3=self.zokusei_hosei_two_3
            self.zokuzen_hosei_two_tan_3=self.zokuzen_hosei_two_3

        resist_3 = self.basic_status_two_3[zokusei_num_zen_two_3]

        additional_mag_3=1
        if self.ids.force_two_3.text=='ドルマ' and zokusei_num_zen_two_3==18:
            additional_mag_3=0.8
        else:
            pass
        if self.ids.bousou_two_3.active:
            if self.skill_buturi_zen_two_3[5]==5:#会心スキル（大暴れ）
                skill_mag_two_3=1
            else:
                pass'''
    ########初期値#########
        if self.ids.monster_two_3.text=='攻撃モンスター':
            self.basic_status_two_3=status.default_m
            power_two_3 =self.basic_status_two_3[2]
            m_power_two_3 =self.basic_status_two_3[4]
        else:
            power_two_3 =self.sosituseikaku_monster_two_3[2]
            m_power_two_3 =self.sosituseikaku_monster_two_3[4]
        if self.ids.monster_two_2.text=='守備モンスター':
            self.basic_status_two_2=status.default_m
            guard_two =self.basic_status_two_2[3]
        else:
            guard_two =self.sosituseikaku_monster_two_2[3]

        if self.ids.buturi_zen_two_3.text=='全体物理':
            self.skill_buturi_zen_two_3=data.none
            skill_mag_two_3=self.skill_buturi_zen_two_3[0]
        else:
            skill_mag_two_3=self.skill_buturi_zen_two_3[0]

        (self.zokusei_hosei_two_3,
         self.zokuzen_hosei_two_3,
         self.keitou_hosei_two_3,
         self.kougeki_hosei_two_3,
         self.baiki_hosei_two_3,
         self.zokusei_tai_hosei_two_3,
         self.keitou_tai_hosei_two_3,
         self.syubi_hosei_two, # shared or should be _two_3? Check original
         self.zantaitai_hosei_two_3,
         self.jumontai_hosei_two_3,
         self.bretai_hosei_two_3,
         self.skala_hosei_two, # shared?
         self.kouma_hosei_two_3,
         self.kiyousa_hosei_two_3) = self.hosei_syokika_two_3()
        if self.ids.force_two_3.text=='ドルマ' and self.skill_buturi_zen_two_3[6] == 10:#無属性=10
            zokusei_num_two_3 = 18  #ドルマ=18
            self.zokusei_hosei_zen_two_3=self.zokusei_hosei_two_3/2
            self.zokuzen_hosei_zen_two_3=self.zokuzen_hosei_two_3/2




    #    elif self.ids.force_two.text=='-':
    #        zokusei_num_two = self.skill_buturi_zen_two[6] #選択全体属性
    #        self.zokusei_hosei_zen_two=self.zokusei_hosei_two
    #        self.zokuzen_hosei_zen_two=self.zokuzen_hosei_two
        else: 
            zokusei_num_two_3 = self.skill_buturi_zen_two_3[6] #選択全体属性
            self.zokusei_hosei_zen_two_3=self.zokusei_hosei_two_3
            self.zokuzen_hosei_zen_two_3=self.zokuzen_hosei_two_3

        resist_3 = self.basic_status_two_2[zokusei_num_two_3] #属性耐性

#        zokusei_num_two = self.skill_buturi_zen_two[6] #選択全体属性
 #       resist = self.basic_status_two_2[zokusei_num_two] #属性耐性

        additional_mag_3=1 #予備
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_two_3==18:
            additional_mag_3=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two_3 = 1  # 
        if self.ids.kouryu_two_3.text == '+1':
            kouryu_mag_two_3 = 1.2
        elif self.ids.kouryu_two_3.text == '+2':
            kouryu_mag_two_3 = 1.4
        else:
            pass
    ######物理計算式########
        if self.ids.bousou_two_3.active:#会心
            if skill_mag_two_3<1:
                skill_mag_two_3=1
            else:
                pass

#######攻魔複合##########
        import math

        if self.skill_buturi_zen_two_3[1]=='hukugou': #攻魔複合なら
            power_two_3 =math.floor(0.85*((power_two_3+self.kougeki_hosei_two_3))*(1+0.2*self.baiki_hosei_two_3)) + math.floor(0.85*(m_power_two_3+self.kouma_hosei_two_3))
            print("power_two_3",power_two_3)
        elif self.skill_buturi_zen_two_3[1]=='koukai': #攻回複合なら
            kaima_two_3 = status.default_m[5] if self.ids.monster_two_3.text == '攻撃モンスター' else self.sosituseikaku_monster_two_3[5]
            power_two_3 =math.floor(0.50*((power_two_3+self.kougeki_hosei_two_3))*(1+0.2*self.baiki_hosei_two_3)) + math.floor(1.30*(kaima_two_3 + self.kouma_hosei_two_3))
            print("power_two_3",power_two_3)
        else:
            power_two_3=(power_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)
            m_power_two_3=m_power_two_3+self.kouma_hosei_two_3

        __,damage_3,damage_center_3,max_damage_zen_two_3,mini_damage_zen_3=CalcDamage.calc_damage_phys(
            power_two_3,self.kougeki_hosei_two_3,
            self.baiki_hosei_two_3,guard_two,
            self.syubi_hosei_two,
            self.skala_hosei_two,
            skill_mag_two_3,resist_3,
            self.zokusei_tai_hosei_two_3,
            self.zantaitai_hosei_two_3,
            self.keitou_tai_hosei_two_3,
            self.zokusei_hosei_two_3,
            self.zokuzen_hosei_two_3,
            self.keitou_hosei_two_3,
            additional_mag_3,
            kouryu_mag_two_3
            )


        import math
        if self.ids.bousou_two_3.active:        
            damage_center_3 = math.floor(1.8*damage_3)
            max_damage_zen_two_3 = math.floor(2*max_damage_zen_two_3)
            mini_damage_zen_3 = math.floor(1.6*mini_damage_zen_3)

        if self.ids.buturi_zen_two_3.text == '全体物理':
            pass
        else:
            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.buturi_zen_two_3.text == '全体物理':
                self.ids.calced_status_two_34.text=str('-')
            elif  (damage_center_3 <= 0) and  ((((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)))>=4/7):
                self.ids.calced_status_two_34.text=str('無効')
            elif (((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two))<1/2):
                self.ids.calced_status_two_34.text=str('<1/2')
            elif (((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two))<4/7):
                self.ids.calced_status_two_34.text=str('<4/7')
            else: 
                self.ids.calced_status_two_34.text=str(damage_center_3)

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.buturi_zen_two_3.text == '全体物理':
                self.ids.calced_status_two_32.text=str('-')
            elif  (mini_damage_zen_3 <= 0) and  ((((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)))>=4/7):
                self.ids.calced_status_two_32.text=str('無効')
            elif (((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two))<4/7):
                self.ids.calced_status_two_32.text=str('-')
            else: 
                self.ids.calced_status_two_32.text=str(mini_damage_zen_3)

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.buturi_zen_two_3.text == '全体物理':
                self.ids.calced_status_two_36.text=str('-')
            elif  (max_damage_zen_two_3 <= 0) and  ((((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)))>=4/7):
                self.ids.calced_status_two_36.text=str('無効')
            elif (((power_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two))<4/7):
                self.ids.calced_status_two_36.text=str('-')
            else: 
                self.ids.calced_status_two_36.text=str(max_damage_zen_two_3)


###########################################



#ダメージ関数（単体物理）
    def damage_phys_tan_two_3(self):

    ########初期値#########
        if self.ids.monster_two_3.text=='攻撃モンスター':
            self.basic_status_two_3=status.default_m
            power_two_3 =self.basic_status_two_3[2]
            m_power_two_3 =self.basic_status_two_3[4]
        else:
            power_two_3 =self.sosituseikaku_monster_two_3[2]
            m_power_two_3 =self.sosituseikaku_monster_two_3[4]
        if self.ids.monster_two_2.text=='守備モンスター':
            self.basic_status_two_2=status.default_m
            guard_two =self.basic_status_two_2[3]
        else:
            guard_two =self.sosituseikaku_monster_two_2[3]
        if self.ids.buturi_tan_two_3.text=='単体物理':
            self.skill_buturi_tan_two_3=data.none
            skill_mag_tan_two_3=self.skill_buturi_tan_two_3[0]
        else:
            skill_mag_tan_two_3=self.skill_buturi_tan_two_3[0]
        (self.zokusei_hosei_two_3, self.zokuzen_hosei_two_3, self.keitou_hosei_two_3, self.kougeki_hosei_two_3, self.baiki_hosei_two_3, self.zokusei_tai_hosei_two_3, self.keitou_tai_hosei_two_3, self.syubi_hosei_two, self.zantaitai_hosei_two_3, self.jumontai_hosei_two_3, self.bretai_hosei_two_3, self.skala_hosei_two, self.kouma_hosei_two_3, self.kiyousa_hosei_two_3) = self.hosei_syokika_two_3()
        
        ##冥王(直撃)
        if self.ids.buturi_tan_two_3.text=='冥王(直撃)':
            guard_two = 0
            self.syubi_hosei_two=0

        if self.ids.force_two_3.text=='ドルマ' and self.skill_buturi_tan_two_3[6] == 10:#無属性=10
            zokusei_num_tan_two_3 = 18  #ドルマ=18
            self.zokusei_hosei_two_tan_3=self.zokusei_hosei_two_3/2
            self.zokuzen_hosei_two_tan_3=self.zokuzen_hosei_two_3/2

       # elif self.ids.force_two.text=='-':
       #     zokusei_num_tan_two = self.skill_buturi_tan_two[6] #選択全体属性
       #     self.zokusei_hosei_two_tan=self.zokusei_hosei_two
       #     self.zokuzen_hosei_two_tan=self.zokuzen_hosei_two
        else: 
            zokusei_num_tan_two_3 = self.skill_buturi_tan_two_3[6] #選択全体属性
            self.zokusei_hosei_two_tan_3=self.zokusei_hosei_two_3
            self.zokuzen_hosei_two_tan_3=self.zokuzen_hosei_two_3

        resist_tan_3 = self.basic_status_two_2[zokusei_num_tan_two_3] #属性耐性

###

 ########





       # zokusei_num_tan_two = self.skill_buturi_tan_two[6]
    #    resist_tan = self.basic_status_two_2[zokusei_num_tan_two]
        additional_mag_tan_3=1
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_tan_two_3==18:
            additional_mag_tan_3=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two_3 = 1  # 
        if self.ids.kouryu_two_3.text == '+1':
            kouryu_mag_two_3 = 1.2
        elif self.ids.kouryu_two_3.text == '+2':
            kouryu_mag_two_3 = 1.4
        else:
            pass
        if self.ids.bousou_two_3.active:
            if self.skill_buturi_tan_two_3[5]==5:#会心スキル（大暴れ）
                skill_mag_tan_two_3=1
            else:
                pass
#######攻魔複合##########
        import math

        if self.skill_buturi_tan_two_3[1]=='hukugou': #攻魔複合なら
            #print("power_two_3",power_two_3,self.kougeki_hosei_two_3,self.baiki_hosei_two_3,m_power_two_3,self.kouma_hosei_two_3)
            power_two_3 =math.floor(0.85*((power_two_3+self.kougeki_hosei_two_3))*(1+0.2*self.baiki_hosei_two_3)) + math.floor(0.85*(m_power_two_3+self.kouma_hosei_two_3))
            #print("power_two_3",power_two_3)
            #print("power_two_3",power_two_3,self.kougeki_hosei_two_3,self.baiki_hosei_two_3,m_power_two_3,self.kouma_hosei_two_3)
        elif self.skill_buturi_tan_two_3[1]=='koukai': #攻回複合なら
            kaima_two_3 = status.default_m[5] if self.ids.monster_two_3.text == '攻撃モンスター' else self.sosituseikaku_monster_two_3[5]
            power_two_3 =math.floor(0.50*((power_two_3+self.kougeki_hosei_two_3))*(1+0.2*self.baiki_hosei_two_3)) + math.floor(1.30*(kaima_two_3 + self.kouma_hosei_two_3))
        else:
            power_two_3=(power_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)
            m_power_two_3=m_power_two_3+self.kouma_hosei_two_3


        __,damage_tan_3,damage_center_tan_3,max_damage_tan_3,mini_damage_tan_3=CalcDamage.calc_damage_phys(
            power_two_3,self.kougeki_hosei_two_3,
            self.baiki_hosei_two_3,guard_two,
            self.syubi_hosei_two,
            self.skala_hosei_two,
            skill_mag_tan_two_3,resist_tan_3,
            self.zokusei_tai_hosei_two_3,
            self.zantaitai_hosei_two_3,
            self.keitou_tai_hosei_two_3,
            self.zokusei_hosei_two_3,
            self.zokuzen_hosei_two_3,
            self.keitou_hosei_two_3,
            additional_mag_tan_3,
            kouryu_mag_two_3
            )


        import math
        #[5]大暴れ型5,物理単発6,1.6~2.0型7)
        if self.ids.bousou_two_3.active:        
            if self.skill_buturi_tan_two_3[5]==5:#会心スキル（大暴れ）
                damage_center_tan_3 = math.floor(1.8*damage_tan_3)
                max_damage_tan_3 = math.floor(2*max_damage_tan_3)
                mini_damage_tan_3 = math.floor(1.6*mini_damage_tan_3)
            elif self.skill_buturi_tan_two_3[5]==7:#会心スキル（デスクロー）
                damage_center_tan_3 = math.floor(1.8*damage_tan_3)
                max_damage_tan_3 = math.floor(2*max_damage_tan_3)
                mini_damage_tan_3 = math.floor(1.6*mini_damage_tan_3)
            elif  self.skill_buturi_tan_two_3[5]==6:#会心スキル（1.6 or kanstu）
                #貫通
                pre_basic_damage_two_tan_3_1 = math.floor(max(0, (power_two_3)))
                pre_damage_tan_3_1 = pre_basic_damage_two_tan_3_1*(resist_tan_3-self.zokusei_tai_hosei_two_3/100)*(additional_mag_tan_3)*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+math.floor(self.zokusei_hosei_two_tan_3+self.zokuzen_hosei_two_tan_3)/100)*(1+self.keitou_hosei_two_3/100)
                pre_damage_tan_3_1 = math.floor(pre_damage_tan_3_1)
                #ｘ1.6
                pre_basic_damage_two_tan_3_2 = math.floor(max(0, (power_two_3)/2 - ((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)/4)))
                pre_damage_tan_3_2 = pre_basic_damage_two_tan_3_2*1.6*skill_mag_tan_two_3*(resist_tan_3-self.zokusei_tai_hosei_two_3/100)*(additional_mag_tan_3)*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+math.floor(self.zokusei_hosei_two_tan_3+self.zokuzen_hosei_two_tan_3)/100)*(1+self.keitou_hosei_two_3/100)
                pre_damage_tan_3_2 = math.floor(pre_damage_tan_3_2)
                
                if pre_damage_tan_3_1>pre_damage_tan_3_2:
                    damage_tan_3 = pre_damage_tan_3_1
                    max_damage_tan_3 = math.floor((pre_basic_damage_two_tan_3_1+math.floor((pre_basic_damage_two_tan_3_1/16)+1))*(resist_tan_3-self.zokusei_tai_hosei_two_3/100)*(additional_mag_tan_3)*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+math.floor(self.zokusei_hosei_two_tan_3+self.zokuzen_hosei_two_tan_3)/100)*(1+self.keitou_hosei_two_3/100))
                    max_damage_tan_3 = math.floor(max_damage_tan_3)
   
                    mini_damage_tan_3 = math.floor((pre_basic_damage_two_tan_3_1-math.floor((pre_basic_damage_two_tan_3_1/16)+1))*(resist_tan_3-self.zokusei_tai_hosei_two_3/100)*(additional_mag_tan_3)*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+math.floor(self.zokusei_hosei_two_tan_3+self.zokuzen_hosei_two_tan_3)/100)*(1+self.keitou_hosei_two_3/100))
                    mini_damage_tan_3 = math.floor(mini_damage_tan_3)
                 #   range_basic_damage_two_tan =math.floor((1+math.floor(pre_basic_damage_two_tan_1/16))*(resist_tan-self.zokusei_tai_hosei_two_3/100)*additional_mag*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+(self.zokusei_hosei_two+self.zokuzen_hosei_two)/100)*(1+self.keitou_hosei_two/100))

                elif pre_damage_tan_3_2>pre_damage_tan_3_1:
                    damage_tan_3 = pre_damage_tan_3_2
                    max_damage_tan_3 = math.floor((pre_basic_damage_two_tan_3_2+math.floor((pre_basic_damage_two_tan_3_2/16)+1))*1.6*skill_mag_tan_two_3*(resist_tan_3-self.zokusei_tai_hosei_two_3/100)*(additional_mag_tan_3)*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+math.floor(self.zokusei_hosei_two_tan_3+self.zokuzen_hosei_two_tan_3)/100)*(1+self.keitou_hosei_two_3/100))
                    max_damage_tan_3 = math.floor(max_damage_tan_3)
   
                    mini_damage_tan_3 = math.floor((pre_basic_damage_two_tan_3_2-math.floor((pre_basic_damage_two_tan_3_2/16)+1))*1.6*skill_mag_tan_two_3*(resist_tan_3-self.zokusei_tai_hosei_two_3/100)*(additional_mag_tan_3)*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+math.floor(self.zokusei_hosei_two_tan_3+self.zokuzen_hosei_two_tan_3)/100)*(1+self.keitou_hosei_two_3/100))
                    mini_damage_tan_3 = math.floor(mini_damage_tan_3)
                #    range_basic_damage_two_tan =math.floor((1+math.floor(pre_basic_damage_two_tan_2/16))*1.6*skill_mag_tan_two*(resist_tan-self.zokusei_tai_hosei_two_3/100)*additional_mag*(1-self.zantaitai_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1+(self.zokusei_hosei_two+self.zokuzen_hosei_two)/100)*(1+self.keitou_hosei_two/100))
                damage_center_tan_3=damage_tan_3


            else:
                pass

        


        if  self.ids.buturi_tan_two_3.text == '単体物理':
            pass
        else:
            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.buturi_tan_two_3.text == '単体物理':
                self.ids.calced_status_two_34.text=str('-')
            elif  (damage_center_tan_3 <= 0) and (power_two_3>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)):
                self.ids.calced_status_two_34.text=str('無効')
            elif (power_two_3<1/2*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)):
                self.ids.calced_status_two_34.text=str('<1/2')
            elif (power_two_3<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)):
                self.ids.calced_status_two_34.text=str('<4/7')
            elif self.ids.bousou_two_3.active and self.skill_buturi_tan_two_3[5]==8:
                self.ids.calced_status_two_34.text='Select x1 skill'
            else: 
                self.ids.calced_status_two_34.text=str(damage_center_tan_3)

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.buturi_tan_two_3.text == '単体物理':
                self.ids.calced_status_two_32.text=str('-')
            elif  mini_damage_tan_3 <= 0 and ((power_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)>=4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)):
                self.ids.calced_status_two_32.text=str('-')
            elif (power_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_32.text=str('-')
            elif self.ids.bousou_two_3.active and self.skill_buturi_tan_two_3[5]==8:
                self.ids.calced_status_two_32.text='-'
            else: 
                self.ids.calced_status_two_32.text=str(mini_damage_tan_3)

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター':
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.buturi_tan_two_3.text == '単体物理':
                self.ids.calced_status_two_36.text=str('-')
            elif  max_damage_tan_3 <= 0 and ((((power_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3))/((guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two)))>=4/7):
                self.ids.calced_status_two_36.text=str('-')
            elif (power_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)<4/7*(guard_two+self.syubi_hosei_two)*(1+0.2*self.skala_hosei_two):
                self.ids.calced_status_two_36.text=str('-')
            elif self.ids.bousou_two_3.active and self.skill_buturi_tan_two_3[5]==8:
                self.ids.calced_status_two_36.text='-'
            else: 
                self.ids.calced_status_two_36.text=str(max_damage_tan_3)

###########################################



#呪文ダメージ関数

    def jumon_damage_two_3(self): #（呪文）
        if self.ids.monster_two_3.text=='攻撃モンスター':
            self.basic_status_two_3=status.default_m
        #    self.basic_status_two_2=status.default_m
            m_power_int_two_3 =self.basic_status_two_3[4]
            k_power_int_two_3 =self.basic_status_two_3[5]
            power_int_two_3 =self.basic_status_two_3[2]
            kiyousa_int_3 =self.basic_status_two_3[7]
        else:
            m_power_int_two_3 =self.sosituseikaku_monster_two_3[4]
            k_power_int_two_3 =self.sosituseikaku_monster_two_3[5]
            power_int_two_3 =self.sosituseikaku_monster_two_3[2]
            kiyousa_int_3 =self.sosituseikaku_monster_two_3[7]

        if self.ids.jumon_two_3.text=='全・呪ブ':
            self.skill_jumon_two_3=data.none
            mini_mpower_int_two_3 = self.skill_jumon_two_3[0] #最低魔力
            mini_power_int_two_3 = self.skill_jumon_two_3[1] #最低威力
            max_mpower_int_two_3 = self.skill_jumon_two_3[2] #最高魔力
            max_power_int_two_3 = self.skill_jumon_two_3[3] #最高威力
            mini_mpower_bint_two_3 = self.skill_jumon_two_3[0] #最低魔力
            mini_power_bint_two_3 = self.skill_jumon_two_3[1] #最低威力
            max_mpower_bint_two_3 = self.skill_jumon_two_3[2] #最高魔力
            max_power_bint_two_3 = self.skill_jumon_two_3[3] #最高威力
        elif self.skill_jumon_two_3[5]== 1: #呪文
            mini_mpower_int_two_3 = self.skill_jumon_two_3[0] #最低魔力
            mini_power_int_two_3 = self.skill_jumon_two_3[1] #最低威力
            max_mpower_int_two_3 = self.skill_jumon_two_3[2] #最高魔力
            max_power_int_two_3 = self.skill_jumon_two_3[3] #最高威力
        elif self.skill_jumon_two_3[5]==3: #回復
            mini_mpower_int_two_3 = self.skill_jumo_3[0] #最低魔力
            mini_power_int_two_3 = self.skill_jumon_two_3[1] #最低威力
            max_mpower_int_two_3 = self.skill_jumon_two_3[2] #最高魔力
            max_power_int_two_3 = self.skill_jumon_two_3[3] #最高威力
        elif self.skill_jumon_two_3[5]==2: #ブレス
            mini_mpower_bint_two_3 = self.skill_jumon_two_3[0] #最低魔力
            mini_power_bint_two_3 = self.skill_jumon_two_3[1] #最低威力
            max_mpower_bint_two_3 = self.skill_jumon_two_3[2] #最高魔力
            max_power_bint_two_3 = self.skill_jumon_two_3[3] #最高威力
        (self.zokusei_hosei_two_3,
         self.zokuzen_hosei_two_3,
         self.keitou_hosei_two_3,
         self.kougeki_hosei_two_3,
         self.baiki_hosei_two_3,
         self.zokusei_tai_hosei_two_3,
         self.keitou_tai_hosei_two_3,
         self.syubi_hosei_two,
         self.zantaitai_hosei_two_3,
         self.jumontai_hosei_two_3,
         self.bretai_hosei_two_3,
         self.skala_hosei_two,
         self.kouma_hosei_two_3,
         self.kiyousa_hosei_two_3) = self.hosei_syokika_two_3()
        if self.ids.zokusei_tai_two_3.text=='0':
            self.zokusei_tai_hosei_two_3=0
        else:
            pass
        if self.ids.keitou_tai_two_3.text=='0':
            self.keitou_tai_hosei_two_3=0
        else:
            pass

        if self.ids.jumontai_two_3.text=='0':
            self.jumontai_hosei_two_3=0
        else:
            pass
        if self.ids.bretai_two_3.text=='0':
            self.bretai_hosei_two_3=0
        else:
            pass
        if self.ids.baiki_two_3.text=='0':
            self.baiki_hosei_two_3=0
        else:
            pass

        if self.ids.skala_two.text=='0':
            self.skala_hosei_two=0
        else:
            pass
        zokusei_num_jumon_two_3 = self.skill_jumon_two_3[6] #選択呪文属性
        resist_jumon_3 = self.basic_status_two_2[zokusei_num_jumon_two_3] #属性耐性
        zokusei_num_breath_two_3 = self.skill_jumon_two_3[6] #選択ブレス属性
        resist_breath_two_3= self.basic_status_two_2[zokusei_num_breath_two_3]#属性耐性
        #additional_mag=1  #予備
        additional_mag_jumon_3=1
        additional_mag_breath_two_3=1
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_jumon_two_3==18:
            additional_mag_jumon_3=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two_3 = 1  # 
        if self.ids.kouryu_two_3.text == '+1':
            kouryu_mag_two_3 = 1.2
        elif self.ids.kouryu_two_3.text == '+2':
            kouryu_mag_two_3 = 1.4
        else:
            pass
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_breath_two_3==18:
            additional_mag_breath_two_3=0.8
        else:
            pass
########呪文＆ブレス計算式(全体用)############

        if self.skill_jumon_two_3[5]==1: #呪文
            basic_damage_two_m_3= (mini_power_int_two_3 + (m_power_int_two_3+self.kouma_hosei_two_3 - mini_mpower_int_two_3) * (max_power_int_two_3 - mini_power_int_two_3) / (max_mpower_int_two_3 - mini_mpower_int_two_3))
            import math
            basic_damage_two_m_3 =math.floor(basic_damage_two_m_3)
            damage_jumon_3= basic_damage_two_m_3*(resist_jumon_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)

            damage_jumon_3 = math.floor(damage_jumon_3)
            max_basic_damage_two_m_3 = basic_damage_two_m_3+math.floor(0.06*basic_damage_two_m_3)
            mini_basic_damage_two_m_3 =  basic_damage_two_m_3-math.floor(0.06*basic_damage_two_m_3)
            max_damage_jumon_3 = max_basic_damage_two_m_3*(resist_jumon_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
            max_damage_jumon_3 =  math.floor(max_damage_jumon_3)
            mini_damage_jumon_3 = mini_basic_damage_two_m_3*(resist_jumon_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
            mini_damage_jumon_3 =  math.floor(mini_damage_jumon_3)
            print("jumon_saiteiha",mini_damage_jumon_3)
        elif self.skill_jumon_two_3[5]==3: #回復呪文
            basic_damage_two_m_3 = (mini_power_int_two_3 + (k_power_int_two_3+self.kouma_hosei_two_3 - mini_mpower_int_two_3) * (max_power_int_two_3- mini_power_int_two_3) / (max_mpower_int_two_3 - mini_mpower_int_two_3))
            import math
            basic_damage_two_m_3 =math.floor(basic_damage_two_m_3)
            damage_jumon_3 = basic_damage_two_m_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)

            damage_jumon_3 = math.floor(damage_jumon_3)
            max_basic_damage_two_m_3 = basic_damage_two_m_3+math.floor(0.06*basic_damage_two_m_3)
            mini_basic_damage_two_m_3 =  basic_damage_two_m_3-math.floor(0.06*basic_damage_two_m_3)
            max_damage_jumon_3 = max_basic_damage_two_m_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
            max_damage_jumon_3 =  math.floor(max_damage_jumon_3)
            mini_damage_jumon_3 = mini_basic_damage_two_m_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
            mini_damage_jumon_3 =  math.floor(mini_damage_jumon_3)

        elif self.skill_jumon_two_3[5]==2: #ブレス
            basic_damage_two_b_3 = (mini_power_bint_two_3 + ((power_int_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)+kiyousa_int_3+self.kiyousa_hosei_two_3 - mini_mpower_bint_two_3) * (max_power_bint_two_3 - mini_power_bint_two_3) / (max_mpower_bint_two_3 - mini_mpower_bint_two_3))
            import math
            basic_damage_two_b_3=math.floor(basic_damage_two_b_3)
            damage_breath_two_3 = basic_damage_two_b_3*(resist_breath_two_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_breath_two_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.bretai_hosei_two_3/100)

            damage_breath_two_3 = math.floor(damage_breath_two_3)
            max_basic_damage_two_b_3 = basic_damage_two_b_3+math.floor(0.06*basic_damage_two_b_3)
            mini_basic_damage_two_b_3 = basic_damage_two_b_3-math.floor(0.06*basic_damage_two_b_3)
            max_damage_breath_two_3 = max_basic_damage_two_b_3*(resist_breath_two_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_breath_two_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.bretai_hosei_two_3/100)
            max_damage_breath_two_3 =  math.floor(max_damage_breath_two_3)
            mini_damage_breath_two_3 = mini_basic_damage_two_b_3*(resist_breath_two_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_breath_two_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.bretai_hosei_two_3/100)
            mini_damage_breath_two_3 =  math.floor(mini_damage_breath_two_3)
        
        if self.skill_jumon_two_3[5]==1:#呪文暴走
            if self.ids.bousou_two_3.active:
                import math
                max_basic_damage_two_m_3 = math.floor(2.0*max_basic_damage_two_m_3)
                max_damage_jumon_3 = max_basic_damage_two_m_3*(resist_jumon_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
                max_damage_jumon_3 =  math.floor(max_damage_jumon_3)
                mini_basic_damage_two_m_3 = math.floor(1.5*mini_basic_damage_two_m_3)
                mini_damage_jumon_3 = mini_basic_damage_two_m_3*(resist_jumon_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
                mini_damage_jumon_3 =  math.floor(mini_damage_jumon_3)
                damage_jumon_3 = math.floor((max_damage_jumon_3+mini_damage_jumon_3)/2)
            else:
                pass
        elif self.skill_jumon_two_3[5]==3:#回復暴走
            if self.ids.bousou_two_3.active:
                import math
                max_basic_damage_two_m_3 = math.floor(2.0*max_basic_damage_two_m_3)
                max_damage_jumon_3 = max_basic_damage_two_m_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
                max_damage_jumon_3 =  math.floor(max_damage_jumon_3)
                mini_basic_damage_two_m_3 = math.floor(1.5*mini_basic_damage_two_m_3)
                mini_damage_jumon_3 = mini_basic_damage_two_m_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
                mini_damage_jumon_3 =  math.floor(mini_damage_jumon_3)
                damage_jumon_3 = math.floor((max_damage_jumon_3+mini_damage_jumon_3)/2)
            else:
                pass
        else:
            pass
######初期値##########
        if self.ids.jumon_two_3.text == '全・呪ブ':
            pass
        else:
            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_jumon_two_3[5]!= 3:
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.jumon_two_3.text == '全・呪ブ':
                self.ids.calced_status_two_34.text=str('-')
            elif self.skill_jumon_two_3[5]==1 and damage_jumon_3<0: #呪文0
                self.ids.calced_status_two_34.text=str(0)
            elif self.skill_jumon_two_3[5]==1: #呪文
                self.ids.calced_status_two_34.text=str(damage_jumon_3)
            elif self.skill_jumon_two_3[5]==3: #回復
                self.ids.calced_status_two_34.text=str(damage_jumon_3)
            elif self.skill_jumon_two_3[5]==2 and damage_breath_two_3<0: #ブレス0
                self.ids.calced_status_two_34.text=str(0)
            elif self.skill_jumon_two_3[5]==2: #ブレス
                self.ids.calced_status_two_34.text=str(damage_breath_two_3)

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_jumon_two_3[5]!= 3:
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.jumon_two_3.text == '全・呪ブ':
                self.ids.calced_status_two_32.text=str('-')
            elif self.skill_jumon_two_3[5]==1 and mini_damage_jumon_3<0: #呪文0
                self.ids.calced_status_two_32.text=str(0)
            elif self.skill_jumon_two_3[5]==1: #呪文
                self.ids.calced_status_two_32.text=str(mini_damage_jumon_3)
            elif self.skill_jumon_two_3[5]==3: #回復
                self.ids.calced_status_two_32.text=str(mini_damage_jumon_3)
            elif self.skill_jumon_two_3[5]==2 and mini_damage_breath_two_3<0: #ブレス0
                self.ids.calced_status_two_32.text=str(0)
            elif self.skill_jumon_two_3[5]==2: #ブレス
                self.ids.calced_status_two_32.text=str(mini_damage_breath_two_3)    

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_jumon_two_3[5]!= 3:
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.jumon_two_3.text == '全・呪ブ':
                self.ids.calced_status_two_36.text=str('-')
            elif self.skill_jumon_two_3[5]==1 and max_damage_jumon_3<0: #呪文0
                self.ids.calced_status_two_36.text=str(0)
            elif self.skill_jumon_two_3[5]==1: #呪文
                self.ids.calced_status_two_36.text=str(max_damage_jumon_3)
            elif self.skill_jumon_two_3[5]==3: #回復
                self.ids.calced_status_two_36.text=str(max_damage_jumon_3)
            elif self.skill_jumon_two_3[5]==2 and max_damage_breath_two_3<0: #ブレス0
                self.ids.calced_status_two_36.text=str(0)
            elif self.skill_jumon_two_3[5]==2: #ブレス
                self.ids.calced_status_two_36.text=str(max_damage_breath_two_3)


#########################################


#単体呪文ブレスダメージ関数
    def breath_damage_two_3(self): #基礎威力関数（呪文ブレス）
        if self.ids.monster_two_3.text=='攻撃モンスター':
            self.basic_status_two_3=status.default_m
            m_power_int_two_3 =self.basic_status_two_3[4]
            k_power_int_two_3 =self.basic_status_two_3[5]
            power_int_two_3 =self.basic_status_two_3[2]
            kiyousa_int_3 =self.basic_status_two_3[7]
        else:
            m_power_int_two_3 =self.sosituseikaku_monster_two_3[4]
            power_int_two_3 =self.sosituseikaku_monster_two_3[2]
            kiyousa_int_3 =self.sosituseikaku_monster_two_3[7]
            k_power_int_two_3 =self.sosituseikaku_monster_two_3[5]
 
        if self.ids.breath_two_3.text=='単・呪ブ':
            self.skill_breath_two_3=data.none
            mini_mpower_int_two_2_3 = self.skill_breath_two_3[0] #最低魔力
            mini_power_int_two_2_3 = self.skill_breath_two_3[1] #最低威力
            max_mpower_int_two_2_3 = self.skill_breath_two_3[2] #最高魔力
            max_power_int_two_2_3 = self.skill_breath_two_3[3] #最高威力
            mini_mpower_bint_two_2_3 = self.skill_breath_two_3[0] #最低魔力
            mini_power_bint_two_2_3 = self.skill_breath_two_3[1] #最低威力
            max_mpower_bint_two_2_3 = self.skill_breath_two_3[2] #最高魔力
            max_power_bint_two_2_3 = self.skill_breath_two_3[3] #最高威力
        elif self.skill_breath_two_3[5]==1: #呪文
            mini_mpower_int_two_2_3 = self.skill_breath_two_3[0] #最低魔力
            mini_power_int_two_2_3 = self.skill_breath_two_3[1] #最低威力
            max_mpower_int_two_2_3 = self.skill_breath_two_3[2] #最高魔力
            max_power_int_two_2_3 = self.skill_breath_two_3[3] #最高威力
        elif self.skill_breath_two_3[5]==3: #回復
            mini_mpower_int_two_2_3 = self.skill_breath_two_3[0] #最低魔力
            mini_power_int_two_2_3 = self.skill_breath_two_3[1] #最低威力
            max_mpower_int_two_2_3 = self.skill_breath_two_3[2] #最高魔力
            max_power_int_two_2_3 = self.skill_breath_two_3[3] #最高威力
        elif self.skill_breath_two_3[5]==2: #ブレス
            mini_mpower_bint_two_2_3 = self.skill_breath_two_3[0] #最低魔力
            mini_power_bint_two_2_3 = self.skill_breath_two_3[1] #最低威力
            max_mpower_bint_two_2_3 = self.skill_breath_two_3[2] #最高魔力
            max_power_bint_two_2_3 = self.skill_breath_two_3[3] #最高威力
        (self.zokusei_hosei_two_3,
         self.zokuzen_hosei_two_3,
         self.keitou_hosei_two_3,
         self.kougeki_hosei_two_3,
         self.baiki_hosei_two_3,
         self.zokusei_tai_hosei_two_3,
         self.keitou_tai_hosei_two_3,
         self.syubi_hosei_two,
         self.zantaitai_hosei_two_3,
         self.jumontai_hosei_two_3,
         self.bretai_hosei_two_3,
         self.skala_hosei_two,
         self.kouma_hosei_two_3,
         self.kiyousa_hosei_two_3) = self.hosei_syokika_two_3()

        if self.ids.skala_two.text=='0':
            self.skala_hosei_two=0
        else:
            pass
        if self.ids.kougeki_two_3.text=='0':
            self.kougeki_hosei_two_3=0
        else:
            pass
        zokusei_num_breath_two_2_3 = self.skill_breath_two_3[6] #選択呪文属性
        resist_jumon_tan_3 = self.basic_status_two_2[zokusei_num_breath_two_2_3] #属性耐性
        zokusei_num_breath_two_3 = self.skill_breath_two_3[6] #選択ブレス属性
        resist_breath_tan_3 = self.basic_status_two_2[zokusei_num_breath_two_3]#属性耐性
        additional_mag_jumon_tan_3=1
        additional_mag_breath_tan_3=1
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_breath_two_2_3==18:
            additional_mag_jumon_tan_3=0.8
        else:
            pass
        # 追加倍率(光竜のかがやき)の計算
        kouryu_mag_two_3 = 1  # 
        if self.ids.kouryu_two_3.text == '+1':
            kouryu_mag_two_3 = 1.2
        elif self.ids.kouryu_two_3.text == '+2':
            kouryu_mag_two_3 = 1.4
        else:
            pass
        if self.ids.force_two_2.text=='ドルマ' and zokusei_num_breath_two_3==18:
            additional_mag_breath_tan_3=0.8
        else:
            pass


#########呪文＆ブレス計算式(単体用)##########

        if self.skill_breath_two_3[5]==1: #呪文
            basic_damage_two_m2_3 = (mini_power_int_two_2_3 + (m_power_int_two_3+self.kouma_hosei_two_3 - mini_mpower_int_two_2_3) * (max_power_int_two_2_3 - mini_power_int_two_2_3) / (max_mpower_int_two_2_3 - mini_mpower_int_two_2_3))
            import math
            basic_damage_two_m2_3 =math.floor(basic_damage_two_m2_3)
            damage_jumon2_3 = basic_damage_two_m2_3*(resist_jumon_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_tan_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)

            damage_jumon2_3 = math.floor(damage_jumon2_3)
            max_basic_damage_two_m2_3 = basic_damage_two_m2_3+math.floor(0.06*basic_damage_two_m2_3)
            mini_basic_damage_two_m2_3 =  basic_damage_two_m2_3-math.floor(0.06*basic_damage_two_m2_3)
            max_damage_jumon2_3 = max_basic_damage_two_m2_3*(resist_jumon_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_tan_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
            max_damage_jumon2_3 =  math.floor(max_damage_jumon2_3)
            mini_damage_jumon2_3 = mini_basic_damage_two_m2_3*(resist_jumon_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_tan_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
            mini_damage_jumon2_3 =  math.floor(mini_damage_jumon2_3)
        elif self.skill_breath_two_3[5]==3: #回復
            basic_damage_two_m2_3 = (mini_power_int_two_2_3 + (k_power_int_two_3+self.kouma_hosei_two_3 - mini_mpower_int_two_2_3) * (max_power_int_two_2_3 - mini_power_int_two_2_3) / (max_mpower_int_two_2_3 - mini_mpower_int_two_2_3))
            import math
            basic_damage_two_m2_3 =math.floor(basic_damage_two_m2_3)
            damage_jumon2_3 = basic_damage_two_m2_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)

            damage_jumon2_3 = math.floor(damage_jumon2_3)
            max_basic_damage_two_m2_3 = basic_damage_two_m2_3+math.floor(0.06*basic_damage_two_m2_3)
            mini_basic_damage_two_m2_3 =  basic_damage_two_m2_3-math.floor(0.06*basic_damage_two_m2_3)
            max_damage_jumon2_3 = max_basic_damage_two_m2_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
            max_damage_jumon2_3 =  math.floor(max_damage_jumon2_3)
            mini_damage_jumon2_3 = mini_basic_damage_two_m2_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
            mini_damage_jumon2_3 =  math.floor(mini_damage_jumon2_3)
        elif self.skill_breath_two_3[5]==2: #ブレス
            basic_damage_two_b2_3 = (mini_power_bint_two_2_3 + ((power_int_two_3+self.kougeki_hosei_two_3)*(1+0.2*self.baiki_hosei_two_3)+kiyousa_int_3+self.kiyousa_hosei_two_3 - mini_mpower_bint_two_2_3) * (max_power_bint_two_2_3 - mini_power_bint_two_2_3) / (max_mpower_bint_two_2_3 - mini_mpower_bint_two_2_3))
            import math
            basic_damage_two_b2_3=math.floor(basic_damage_two_b2_3)
            damage_breath2_3 = basic_damage_two_b2_3*(resist_breath_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_breath_tan_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.bretai_hosei_two_3/100)

            damage_breath2_3 = math.floor(damage_breath2_3)
            max_basic_damage_two_b2_3 = basic_damage_two_b2_3+math.floor(0.06*basic_damage_two_b2_3)
            mini_basic_damage_two_b2_3 = basic_damage_two_b2_3-math.floor(0.06*basic_damage_two_b2_3)
            max_damage_breath2_3 = max_basic_damage_two_b2_3*(resist_breath_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_breath_tan_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.bretai_hosei_two_3/100)
            max_damage_breath2_3 =  math.floor(max_damage_breath2_3)
            mini_damage_breath2_3 = mini_basic_damage_two_b2_3*(resist_breath_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_breath_tan_3*kouryu_mag_two_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.bretai_hosei_two_3/100)
            mini_damage_breath2_3 =  math.floor(mini_damage_breath2_3)

        if self.skill_breath_two_3[5]== 1 : #呪文暴走
            if  self.ids.bousou_two_3.active:
                import math
                max_basic_damage_two_m2_3 = math.floor(2.0*max_basic_damage_two_m2_3)
                max_damage_jumon2_3 = max_basic_damage_two_m2_3*(resist_jumon_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_tan_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
                max_damage_jumon2_3 =  math.floor(max_damage_jumon2_3)

                mini_basic_damage_two_m2_3 = math.floor(1.5*mini_basic_damage_two_m2_3)
                mini_damage_jumon2_3 = mini_basic_damage_two_m2_3*(resist_jumon_tan_3-self.zokusei_tai_hosei_two_3/100)*additional_mag_jumon_tan_3*(1+self.zokusei_hosei_two_3/100+self.zokuzen_hosei_two_3/100)*(1+self.keitou_hosei_two_3/100)*(1-self.keitou_tai_hosei_two_3/100)*(1-self.jumontai_hosei_two_3/100)
                mini_damage_jumon2_3 =  math.floor(mini_damage_jumon2_3)
                damage_jumon2_3 = (max_damage_jumon2_3+mini_damage_jumon2_3)/2
            else:
                pass
        elif self.skill_breath_two_3[5]== 3 : #回復暴走
            if  self.ids.bousou_two_3.active:
                import math
                max_basic_damage_two_m2_3 = math.floor(2.0*max_basic_damage_two_m2_3)
                max_damage_jumon2_3 = max_basic_damage_two_m2_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
                max_damage_jumon2_3 =  math.floor(max_damage_jumon2_3)

                mini_basic_damage_two_m2_3 = math.floor(1.5*mini_basic_damage_two_m2_3)
                mini_damage_jumon2_3 = mini_basic_damage_two_m2_3*(1+self.zokusei_hosei_two_3/100)*(1+self.zokuzen_hosei_two_3/100)
                mini_damage_jumon2_3 =  math.floor(mini_damage_jumon2_3)
                damage_jumon2_3 = (max_damage_jumon2_3+mini_damage_jumon2_3)/2
            else:
                pass                
                
        else:
            pass
######初期値##########
        if self.ids.breath_two_3.text == '単・呪ブ':
            pass
        else:
            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_breath_two_3[5]!=3:
                self.ids.calced_status_two_34.text=str('-')
            elif  self.ids.breath_two_3.text == '単・呪ブ':
                self.ids.calced_status_two_34.text=str('-')
            elif self.skill_breath_two_3[5]==1 and damage_jumon2_3<0: #呪文0
                self.ids.calced_status_two_34.text=str(0)
            elif self.skill_breath_two_3[5]==1: #呪文
                self.ids.calced_status_two_34.text=str(damage_jumon2_3)
            elif self.skill_breath_two_3[5]==3: #回復
                self.ids.calced_status_two_34.text=str(damage_jumon2_3)
            elif self.skill_breath_two_3[5]==34 and damage_breath2_3<0: #ブレス0
                self.ids.calced_status_two_34.text=str(0)
            elif self.skill_breath_two_3[5]==2: #ブレス
                self.ids.calced_status_two_34.text=str(damage_breath2_3)

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_breath_two_3[5]!=3:
                self.ids.calced_status_two_32.text=str('-')
            elif  self.ids.breath_two_3.text == '単・呪ブ':
                self.ids.calced_status_two_32.text=str('-')
            elif self.skill_breath_two_3[5]==1 and mini_damage_jumon2_3<0: #呪文0
                self.ids.calced_status_two_32.text=str(0)
            elif self.skill_breath_two_3[5]==1: #呪文
                self.ids.calced_status_two_32.text=str(mini_damage_jumon2_3)
            elif self.skill_breath_two_3[5]==3: #回復
                self.ids.calced_status_two_32.text=str(mini_damage_jumon2_3)
            elif self.skill_breath_two_3[5]==2 and mini_damage_breath2_3<0: #ブレス0
                self.ids.calced_status_two_32.text=str(0)
            elif self.skill_breath_two_3[5]==2: #ブレス
                self.ids.calced_status_two_32.text=str(mini_damage_breath2_3)    

            if self.ids.monster_two_3.text == '攻撃モンスター':
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.monster_two_2.text == '守備モンスター' and self.skill_breath_two_3[5]!=3:
                self.ids.calced_status_two_36.text=str('-')
            elif  self.ids.breath_two_3.text == '単・呪ブ':
                self.ids.calced_status_two_36.text=str('-')
            elif self.skill_breath_two_3[5]==1 and max_damage_jumon2_3<0: #呪文0
                self.ids.calced_status_two_36.text=str(0)
            elif self.skill_breath_two_3[5]==1: #呪文
                self.ids.calced_status_two_36.text=str(max_damage_jumon2_3)
            elif self.skill_breath_two_3[5]==3: #回復
                self.ids.calced_status_two_36.text=str(max_damage_jumon2_3)
            elif self.skill_breath_two_3[5]==2 and max_damage_breath2_3<0: #ブレス0
                self.ids.calced_status_two_36.text=str(0)
            elif self.skill_breath_two_3[5]==2: #ブレス
                self.ids.calced_status_two_36.text=str(max_damage_breath2_3)


##################################################################################
##################################################################################



    def on_sositu_selection_two(self,text):
        #if self.root_widget: #これなに？
        #    Generate_Monster.monster_selection(text)
        self.sositu_hosei_two=Generate_Monster.sositu_selection(self.ids.sositu_two.text)
        return self.sositu_hosei_two

    def on_sositu_selection_two_2(self, text):
        self.sositu_hosei_two_2=Generate_Monster.sositu_selection(self.ids.sositu_two_2.text)
        return self.sositu_hosei_two_2
    
    def on_sositu_selection_two_3(self, text):
        self.sositu_hosei_two_3=Generate_Monster.sositu_selection(self.ids.sositu_two_3.text)
        return self.sositu_hosei_two_3

    def on_seikaku_selection_two(self, text):
        self.seikaku_hosei_two=Generate_Monster.seikaku_selection(self.ids.seikaku_two.text)
        #print("seikaku-wa",text,"hosei-wa",self.seikaku_hosei_two)
        return self.seikaku_hosei_two

    def on_seikaku_selection_two_2(self, text):
        self.seikaku_hosei_two_2=Generate_Monster.seikaku_selection(self.ids.seikaku_two_2.text)
        #print("seikaku2-wa",text,"hosei2-wa",self.seikaku_hosei_two_2)
        return self.seikaku_hosei_two_2
    
    def on_seikaku_selection_two_3(self, text):
        self.seikaku_hosei_two_3=Generate_Monster.seikaku_selection(self.ids.seikaku_two_3.text)
        #print("seikaku2-wa",text,"hosei2-wa",self.seikaku_hosei_two_2)
        return self.seikaku_hosei_two_3

    def on_monster_selection_two(self,text):
        self.basic_status_two=Generate_Monster.monster_selection(self.ids.monster_two.text)
        return self.basic_status_two

    def on_monster_selection_two_2(self,text):
        self.basic_status_two_2=Generate_Monster.monster_selection(self.ids.monster_two_2.text)
        return self.basic_status_two_2

    def on_monster_selection_two_3(self,text):
        self.basic_status_two_3=Generate_Monster.monster_selection(self.ids.monster_two_3.text)
        return self.basic_status_two_3




######スキルselection##########
#全体物理

    def on_buturi_zen_selection_two(self, text):
        #self.skill_buturi_zen_two = Generate_Monster.buturi_zen_selection(self.ids.buturi_zen_two.text, self.basic_status_two_2)
        self.skill_buturi_zen_two, display_text = Generate_Monster.buturi_zen_selection(self.ids.buturi_zen_two.text, self.basic_status_two_2)

 
        if (self.ids.buturi_zen_two.text == '全体物理' and 
            self.ids.buturi_tan_two.text == '単体物理' and 
            self.ids.jumon_two.text == '全・呪ブ' and 
            self.ids.breath_two.text == '単・呪ブ'):
            self.ids.calced_status_two_101.text = "-"
            return

        if self.ids.buturi_zen_two.text == '全体物理':
            return

        attribute_mapping = {
            10: "無属性",
            11: "メラ",
            12: "ギラ",
            13: "イオ",
            14: "ヒャド",
            15: "バギ",
            16: "ジバ",
            17: "デイン",
            18: "ドルマ",
            37: "ザバ",
        }

        attribute_value = self.skill_buturi_zen_two[6]
        force_value = self.ids.force_two.text

        if attribute_value == 10 and force_value == 'ドルマ':
            self.ids.calced_status_two_101.text = "ドルフォ"
        else:
            self.ids.calced_status_two_101.text = attribute_mapping.get(attribute_value, "無属性")




#属性[6](10無 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル,19全体回復)
#単体物理
    def on_buturi_tan_selection_two(self,text):
        self.skill_buturi_tan_two,temp=Generate_Monster.buturi_tan_selection(self.ids.buturi_tan_two.text, self.basic_status_two_2)
        if self.ids.buturi_zen_two.text=='全体物理' and self.ids.buturi_tan_two.text=='単体物理' and self.ids.jumon_two.text=='全・呪ブ' and self.ids.breath_two.text=='単・呪ブ':
            self.ids.calced_status_two_101.text = "-"
        elif self.ids.buturi_tan_two.text=='単体物理':
            pass
        elif self.skill_buturi_tan_two[6]==10 and self.ids.force_two.text=='ドルマ':
            self.ids.calced_status_two_101.text = "ドルフォ"
        elif self.skill_buturi_tan_two[6]==10:
            self.ids.calced_status_two_101.text = "無属性"
        elif self.skill_buturi_tan_two[6]==11:
            self.ids.calced_status_two_101.text = "メラ"
        elif self.skill_buturi_tan_two[6]==12:
            self.ids.calced_status_two_101.text = "ギラ"
        elif self.skill_buturi_tan_two[6]==13:
            self.ids.calced_status_two_101.text = "イオ"
        elif self.skill_buturi_tan_two[6]==14:
            self.ids.calced_status_two_101.text = "ヒャド"
        elif self.skill_buturi_tan_two[6]==15:
            self.ids.calced_status_two_101.text = "バギ"
        elif self.skill_buturi_tan_two[6]==16:
            self.ids.calced_status_two_101.text = "ジバ"
        elif self.skill_buturi_tan_two[6]==17:
            self.ids.calced_status_two_101.text = "デイン"
        elif self.skill_buturi_tan_two[6]==18:
            self.ids.calced_status_two_101.text = "ドルマ"   
        elif self.skill_buturi_tan_two[6]==37:
            self.ids.calced_status_two_101.text = "ザバ"   
        else:
            pass 


#34系統: 0けもの 1ドラゴン 2物質 3エレメント 4ゾンビ 5水 6悪魔 7植物 8スライム 9鳥 10？？？ 11マシン 12虫 13怪人


#全呪・ブレ
    def on_jumon_selection_two(self, text):
        self.skill_jumon_two = Generate_Monster.jumon_selection(self.ids.jumon_two.text)
        if self.skill_jumon_two is None:
            return  # エラーを避けるために処理を終了

        if (self.ids.buturi_zen_two.text == '全体物理' and 
            self.ids.buturi_tan_two.text == '単体物理' and 
            self.ids.jumon_two.text == '全・呪ブ' and 
            self.ids.breath_two.text == '単・呪ブ'):
            self.ids.calced_status_two_101.text = "-"
        elif self.ids.jumon_two.text == '全・呪ブ':
            pass
        else:
            attribute_value = self.skill_jumon_two[6]
            attribute_mapping = {
                10: "無属性",
                11: "メラ",
                12: "ギラ",
                13: "イオ",
                14: "ヒャド",
                15: "バギ",
                16: "ジバ",
                17: "デイン",
                18: "ドルマ",
                37: "ザバ",
                19: "回復",
            }
            self.ids.calced_status_two_101.text = attribute_mapping.get(attribute_value, "無属性")


#単呪・ブレ
    def on_breath_selection_two(self,text):

        self.skill_breath_two=Generate_Monster.breath_selection(self.ids.breath_two.text)
        if self.ids.buturi_zen_two.text=='全体物理' and self.ids.buturi_tan_two.text=='単体物理' and self.ids.jumon_two.text=='全・呪ブ' and self.ids.breath_two.text=='単・呪ブ':
            self.ids.calced_status_two_101.text = "-"
        elif self.ids.breath_two.text=='単・呪ブ':
            pass
        elif self.skill_breath_two[6]==10:
            self.ids.calced_status_two_101.text = "無属性"
        elif self.skill_breath_two[6]==11:
            self.ids.calced_status_two_101.text = "メラ"
        elif self.skill_breath_two[6]==12:
            self.ids.calced_status_two_101.text = "ギラ"
        elif self.skill_breath_two[6]==13:
            self.ids.calced_status_two_101.text = "イオ"
        elif self.skill_breath_two[6]==14:
            self.ids.calced_status_two_101.text = "ヒャド"
        elif self.skill_breath_two[6]==15:
            self.ids.calced_status_two_101.text = "バギ"
        elif self.skill_breath_two[6]==16:
            self.ids.calced_status_two_101.text = "ジバ"
        elif self.skill_breath_two[6]==17:
            self.ids.calced_status_two_101.text = "デイン"
        elif self.skill_breath_two[6]==18:
            self.ids.calced_status_two_101.text = "ドルマ"
        elif self.skill_breath_two[6]==37:
            self.ids.calced_status_two_101.text = "ザバ"
        elif self.skill_breath_two[6]==19:
            self.ids.calced_status_two_101.text = "回復"
        else:
            pass

######スキルselection##########
#全体物理
    def on_buturi_zen_selection_two_3(self,text):
        self.skill_buturi_zen_two_3, temp=Generate_Monster.buturi_zen_selection(self.ids.buturi_zen_two_3.text, self.basic_status_two_2)

        if self.ids.buturi_zen_two_3.text=='全体物理' and self.ids.buturi_tan_two_3.text=='単体物理' and self.ids.jumon_two_3.text=='全・呪ブ' and self.ids.breath_two_3.text=='単・呪ブ':
           self.ids.calced_status_two_102.text = "-"
        elif self.ids.buturi_zen_two_3.text=='全体物理':
            pass
        elif self.skill_buturi_zen_two_3[6]==10 and self.ids.force_two_3.text=='ドルマ':
            self.ids.calced_status_two_102.text = "ドルフォ"
        elif self.skill_buturi_zen_two_3[6]==10:
            self.ids.calced_status_two_102.text = "無属性"
        elif self.skill_buturi_zen_two_3[6]==11:
            self.ids.calced_status_two_102.text = "メラ"
        elif self.skill_buturi_zen_two_3[6]==12:
            self.ids.calced_status_two_102.text = "ギラ"
        elif self.skill_buturi_zen_two_3[6]==13:
            self.ids.calced_status_two_102.text = "イオ"
        elif self.skill_buturi_zen_two_3[6]==14:
            self.ids.calced_status_two_102.text = "ヒャド"
        elif self.skill_buturi_zen_two_3[6]==15:
            self.ids.calced_status_two_102.text = "バギ"
        elif self.skill_buturi_zen_two_3[6]==16:
            self.ids.calced_status_two_102.text = "ジバ"
        elif self.skill_buturi_zen_two_3[6]==17:
            self.ids.calced_status_two_102.text = "デイン"
        elif self.skill_buturi_zen_two_3[6]==18:
            self.ids.calced_status_two_102.text = "ドルマ"
        elif self.skill_buturi_zen_two_3[6]==37:
            self.ids.calced_status_two_102.text = "ザバ"
        else:
            pass
        
#属性[6](10無 11メラ,12ギラ,13イオ,14ヒャド,15バギ,16ジバ,17デイ,18ドル,19全体回復)
#単体物理
    def on_buturi_tan_selection_two_3(self,text):
        self.skill_buturi_tan_two_3,temp=Generate_Monster.buturi_tan_selection(self.ids.buturi_tan_two_3.text, self.basic_status_two_2)
        if self.ids.buturi_zen_two_3.text=='全体物理' and self.ids.buturi_tan_two_3.text=='単体物理' and self.ids.jumon_two_3.text=='全・呪ブ' and self.ids.breath_two_3.text=='単・呪ブ':
            self.ids.calced_status_two_102.text = "-"
        elif self.ids.buturi_tan_two_3.text=='単体物理':
            pass
        elif self.skill_buturi_tan_two_3[6]==10 and self.ids.force_two_3.text=='ドルマ':
            self.ids.calced_status_two_102.text = "ドルフォ"
        elif self.skill_buturi_tan_two_3[6]==10:
            self.ids.calced_status_two_102.text = "無属性"
        elif self.skill_buturi_tan_two_3[6]==11:
            self.ids.calced_status_two_102.text = "メラ"
        elif self.skill_buturi_tan_two_3[6]==12:
            self.ids.calced_status_two_102.text = "ギラ"
        elif self.skill_buturi_tan_two_3[6]==13:
            self.ids.calced_status_two_102.text = "イオ"
        elif self.skill_buturi_tan_two_3[6]==14:
            self.ids.calced_status_two_102.text = "ヒャド"
        elif self.skill_buturi_tan_two_3[6]==15:
            self.ids.calced_status_two_102.text = "バギ"
        elif self.skill_buturi_tan_two_3[6]==16:
            self.ids.calced_status_two_102.text = "ジバ"
        elif self.skill_buturi_tan_two_3[6]==17:
            self.ids.calced_status_two_102.text = "デイン"
        elif self.skill_buturi_tan_two_3[6]==18:
            self.ids.calced_status_two_102.text = "ドルマ"    
        elif self.skill_buturi_tan_two_3[6]==37:
            self.ids.calced_status_two_102.text = "ザバ"   
        else:
            pass

#34系統: 0けもの 1ドラゴン 2物質 3エレメント 4ゾンビ 5水 6悪魔 7植物 8スライム 9鳥 10？？？ 11マシン 12虫 13怪人


#全呪・ブレ
    def on_jumon_selection_two_3(self, text):
        self.skill_jumon_two_3 = Generate_Monster.jumon_selection(self.ids.jumon_two_3.text)
        if self.skill_jumon_two_3 is None:
            return  # エラーを避けるために処理を終了

        if (self.ids.buturi_zen_two_3.text == '全体物理' and 
            self.ids.buturi_tan_two_3.text == '単体物理' and 
            self.ids.jumon_two_3.text == '全・呪ブ' and 
            self.ids.breath_two_3.text == '単・呪ブ'):
            self.ids.calced_status_two_102.text = "-"
        elif self.ids.jumon_two_3.text == '全・呪ブ':
            pass
        else:
            attribute_value = self.skill_jumon_two_3[6]
            attribute_mapping = {
                10: "無属性",
                11: "メラ",
                12: "ギラ",
                13: "イオ",
                14: "ヒャド",
                15: "バギ",
                16: "ジバ",
                17: "デイン",
                18: "ドルマ",
                37: "ザバ",
                19: "回復",
            }
            self.ids.calced_status_two_102.text = attribute_mapping.get(attribute_value, "無属性")


#単呪・ブレ
    def on_breath_selection_two_3(self,text):
        self.skill_breath_two_3=Generate_Monster.breath_selection(self.ids.breath_two_3.text)
        if self.ids.buturi_zen_two_3.text=='全体物理' and self.ids.buturi_tan_two_3.text=='単体物理' and self.ids.jumon_two_3.text=='全・呪ブ' and self.ids.breath_two_3.text=='単・呪ブ':
            self.ids.calced_status_two_102.text = "-"
        elif self.ids.breath_two_3.text=='単・呪ブ':
            pass
        elif self.skill_breath_two_3[6]==10:
            self.ids.calced_status_two_102.text = "無属性"
        elif self.skill_breath_two_3[6]==11:
            self.ids.calced_status_two_102.text = "メラ"
        elif self.skill_breath_two_3[6]==12:
            self.ids.calced_status_two_102.text = "ギラ"
        elif self.skill_breath_two_3[6]==13:
            self.ids.calced_status_two_102.text = "イオ"
        elif self.skill_breath_two_3[6]==14:
            self.ids.calced_status_two_102.text = "ヒャド"
        elif self.skill_breath_two_3[6]==15:
            self.ids.calced_status_two_102.text = "バギ"
        elif self.skill_breath_two_3[6]==16:
            self.ids.calced_status_two_102.text = "ジバ"
        elif self.skill_breath_two_3[6]==17:
            self.ids.calced_status_two_102.text = "デイン"
        elif self.skill_breath_two_3[6]==18:
            self.ids.calced_status_two_102.text = "ドルマ"
        elif self.skill_breath_two_3[6]==37:
            self.ids.calced_status_two_102.text = "ザバ"
        elif self.skill_breath_two_3[6]==19:
            self.ids.calced_status_two_102.text = "回復"
        else:
            pass



######攻撃継承selection##########

    def on_zokusei_selection_two(self,text):
        import re
        self.zokusei_hosei_two=int(re.sub(r"\D", "", self.ids.zokusei_two.text))
        print(self.zokusei_hosei_two)


    def on_zokuzen_selection_two(self,text):
        import re
        self.zokuzen_hosei_two=int(re.sub(r"\D", "", self.ids.zokuzen_two.text))
        print(self.zokuzen_hosei_two)

    def on_keitou_selection_two(self,text):
        import re
        self.keitou_hosei_two=int(re.sub(r"\D", "", self.ids.keitou_two.text))
        print(self.keitou_hosei_two)

    def on_kougeki_selection_two(self,text):
        import re
        self.kougeki_hosei_two=int(re.sub(r"\D", "", self.ids.kougeki_two.text))
        print(self.kougeki_hosei_two)

    def on_kouma_selection_two(self,text):
        import re
        self.kouma_hosei_two=int(re.sub(r"\D", "", self.ids.kouma_two.text))
        print(self.kouma_hosei_two)

    def on_kiyousa_selection_two(self,text):
        import re
        self.kiyousa_hosei_two=int(re.sub(r"\D", "", self.ids.kiyousa_two.text))
        print(self.kiyousa_hosei_two)

    def on_baiki_selection_two(self,text):
        self.baiki_hosei_two=int(self.ids.baiki_two.text)
       # import re
      #  self.baiki_hosei_two=int(re.sub(r"\D", "", self.ids.baiki_two.text))
        print(self.baiki_hosei_two)

##########攻撃継承selection(2nd)#############################
    def on_zokusei_selection_two_3(self,text):
        import re
        self.zokusei_hosei_two_3=int(re.sub(r"\D", "", self.ids.zokusei_two_3.text))
        print(self.zokusei_hosei_two_3)


    def on_zokuzen_selection_two_3(self,text):
        import re
        self.zokuzen_hosei_two_3=int(re.sub(r"\D", "", self.ids.zokuzen_two_3.text))
        print(self.zokuzen_hosei_two_3)

    def on_keitou_selection_two_3(self,text):
        import re
        self.keitou_hosei_two_3=int(re.sub(r"\D", "", self.ids.keitou_two_3.text))
        print(self.keitou_hosei_two_3)

    def on_kougeki_selection_two_3(self,text):
        import re
        self.kougeki_hosei_two_3=int(re.sub(r"\D", "", self.ids.kougeki_two_3.text))
        print(self.kougeki_hosei_two_3)

    def on_kouma_selection_two_3(self,text):
        import re
        self.kouma_hosei_two_3=int(re.sub(r"\D", "", self.ids.kouma_two_3.text))
        print(self.kouma_hosei_two_3)

    def on_kiyousa_selection_two_3(self,text):
        import re
        self.kiyousa_hosei_two_3=int(re.sub(r"\D", "", self.ids.kiyousa_two_3.text))
        print(self.kiyousa_hosei_two_3)

    def on_baiki_selection_two_3(self,text):
        self.baiki_hosei_two_3=int(self.ids.baiki_two_3.text)
       # import re
      #  self.baiki_hosei_two=int(re.sub(r"\D", "", self.ids.baiki_two.text))
        print(self.baiki_hosei_two_3)

######守備継承selection##########


    '''def on_selection(self, text, attr, widget_id):
        import re
        if self.ids[widget_id].text.isdigit():
            setattr(self, attr, int(re.sub(r"\D", "", self.ids[widget_id].text)))
    def on_zantaitai_selection_two_3(self, text):
        self.on_selection(text, 'zantaitai_hosei_two_3', 'zantaitai_two_3')

    def on_jumontai_selection_two(self, text):
        self.on_selection(text, 'jumontai_hosei_two', 'jumontai_two')

    def on_jumontai_selection_two_3(self, text):
        self.on_selection(text, 'jumontai_hosei_two_3', 'jumontai_two_3')

    def on_bretai_selection_two(self, text):
        self.on_selection(text, 'bretai_hosei_two', 'bretai_two')

    def on_bretai_selection_two_3(self, text):
        self.on_selection(text, 'bretai_hosei_two_3', 'bretai_two_3')

    def on_skala_selection_two(self, text):
        self.on_selection(text, 'skala_hosei_two', 'skala_two')
        #print('onスカラ',self.skala_hosei_two)
    def on_syubi_selection_two(self, text):
        self.on_selection(text, 'syubi_hosei_two', 'syubi_two')'''
        
    def on_zokusei_tai_selection_two(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.zokusei_tai_two.text)
        self.zokusei_tai_hosei_two = int(val) if val else 0
        print(self.zokusei_tai_hosei_two)
    def on_zokusei_tai_selection_two_3(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.zokusei_tai_two_3.text)
        self.zokusei_tai_hosei_two_3 = int(val) if val else 0
        print(self.zokusei_tai_hosei_two_3)

    def on_keitou_tai_selection_two(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.keitou_tai_two.text)
        self.keitou_tai_hosei_two = int(val) if val else 0
        print(self.keitou_tai_hosei_two)
    def on_keitou_tai_selection_two_3(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.keitou_tai_two_3.text)
        self.keitou_tai_hosei_two_3 = int(val) if val else 0
        print(self.keitou_tai_hosei_two_3)


    def on_zantaitai_selection_two(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.zantaitai_two.text)
        self.zantaitai_hosei_two = int(val) if val else 0
        print(self.zantaitai_hosei_two)
    def on_zantaitai_selection_two_3(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.zantaitai_two_3.text)
        self.zantaitai_hosei_two_3 = int(val) if val else 0
        print(self.zantaitai_hosei_two_3)        

    def on_jumontai_selection_two(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.jumontai_two.text)
        self.jumontai_hosei_two = int(val) if val else 0
        print(self.jumontai_hosei_two)
    def on_jumontai_selection_two_3(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.jumontai_two_3.text)
        self.jumontai_hosei_two_3 = int(val) if val else 0
        print(self.jumontai_hosei_two_3)

    def on_bretai_selection_two(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.bretai_two.text)
        self.bretai_hosei_two = int(val) if val else 0
        print(self.bretai_hosei_two)
    def on_bretai_selection_two_3(self,text):
        import re
        val = re.sub(r"\D", "", self.ids.bretai_two_3.text)
        self.bretai_hosei_two_3 = int(val) if val else 0
        print(self.bretai_hosei_two_3)

    def on_skala_selection_two(self,text):
        try:
            self.skala_hosei_two=int(self.ids.skala_two.text)
        except (ValueError, AttributeError):
            self.skala_hosei_two=0

        print(self.skala_hosei_two)

    def on_syubi_selection_two(self,text):
        try:
            import re
            self.syubi_hosei_two=int(re.sub(r"\D", "", self.ids.syubi_two.text))
        except (ValueError, AttributeError):
            self.syubi_hosei_two=0
        print(self.syubi_hosei_two)

    def on_reset_press_two(self,text):
        self.ids.buturi_zen_two.text='全体物理'
        self.ids.buturi_tan_two.text='単体物理'
        self.ids.jumon_two.text='全・呪ブ'
        self.ids.breath_two.text='単・呪ブ'
        self.ids.monster_two.text='攻撃モンスター'
        self.ids.sositu_two.text='素質'
        self.ids.seikaku_two.text='性格'
        self.ids.monster_two_2.text='守備モンスター'
        self.ids.sositu_two_2.text='素質'
        self.ids.seikaku_two_2.text='性格'
        self.ids.zokusei_two.text='0'
        self.ids.zokuzen_two.text='0'
        self.ids.keitou_two.text='0'
        self.ids.kougeki_two.text='0'
        self.ids.kouma_two.text='0'
        self.ids.kiyousa_two.text='0'
        self.ids.baiki_two.text='0'
        self.ids.HP_1st.text='0'
        self.ids.zokusei_tai_two.text='属性耐'
        self.ids.keitou_tai_two.text='系統耐'
        self.ids.syubi_two.text='0'
        self.ids.zantaitai_two.text='斬体耐'
        self.ids.jumontai_two.text='呪文耐'
        self.ids.bretai_two.text='ブレ耐'
        self.ids.skala_two.text='0'
        self.ids.calced_status_two_26.text=str('-')
        self.ids.calced_status_two_28.text=str('-')
        self.ids.calced_status_two_30.text=str('-')

    def on_reset_press_two_3(self,text):
        self.ids.buturi_zen_two_3.text='全体物理'
        self.ids.buturi_tan_two_3.text='単体物理'
        self.ids.jumon_two_3.text='全・呪ブ'
        self.ids.breath_two_3.text='単・呪ブ'
        self.ids.monster_two_3.text='攻撃モンスター'
        self.ids.sositu_two_3.text='素質'
        self.ids.seikaku_two_3.text='性格'
        self.ids.monster_two_2.text='守備モンスター'
        self.ids.sositu_two_2.text='素質'
        self.ids.seikaku_two_2.text='性格'
        self.ids.zokusei_two_3.text='0'
        self.ids.zokuzen_two_3.text='0'
        self.ids.keitou_two_3.text='0'
        self.ids.kougeki_two_3.text='0'
        self.ids.kouma_two_3.text='0'
        self.ids.kiyousa_two_3.text='0'
        self.ids.baiki_two_3.text='0'
        self.ids.zokusei_tai_two_3.text='属性耐'
        self.ids.keitou_tai_two_3.text='系統耐'
        self.ids.syubi_two.text='0'
        self.ids.zantaitai_two_3.text='斬体耐'
        self.ids.jumontai_two_3.text='呪文耐'
        self.ids.bretai_two_3.text='ブレ耐'
        self.ids.skala_two.text='0'
        self.ids.calced_status_two_32.text=str('-')
        self.ids.calced_status_two_34.text=str('-')
        self.ids.calced_status_two_36.text=str('-')

    def sosituseikaku_two(self):
        if self.ids.sositu_two.text=='素質':
            self.sositu_hosei_two=1
        else:
            pass
        if self.ids.seikaku_two.text=='性格':
            self.seikaku_hosei_two=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        else:
            pass

        if self.ids.monster_two.text=='攻撃モンスター':
            self.basic_status_two=status.default_m
        else:
            pass

        import math
        self.sosituseikaku_monster_two = [math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[0]*self.basic_status_two[0]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[1]*self.basic_status_two[1]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[2]*self.basic_status_two[2]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[3]*self.basic_status_two[3]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[4]*self.basic_status_two[4]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[5]*self.basic_status_two[5]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[6]*self.basic_status_two[6]), math.ceil(self.sositu_hosei_two*self.seikaku_hosei_two[7]*self.basic_status_two[7]), self.basic_status_two[8], self.basic_status_two[9], self.basic_status_two[10], self.basic_status_two[11], self.basic_status_two[12], self.basic_status_two[13], self.basic_status_two[14], self.basic_status_two[15], self.basic_status_two[16], self.basic_status_two[17], self.basic_status_two[18], self.basic_status_two[19]] 
        print("final_status-wa",self.sosituseikaku_monster_two)
        tikara=str(self.sosituseikaku_monster_two[2])
        kouma=str(self.sosituseikaku_monster_two[4])
        kaima=str(self.sosituseikaku_monster_two[5])
        kiyou=str(self.sosituseikaku_monster_two[7])

        self.ids.calced_status_two_4.text=str(tikara)
        self.ids.calced_status_two_5.text=str(kouma)
        self.ids.calced_status_two_6.text=str(int(tikara)+int(kiyou))
        self.ids.calced_status_two_52.text=str(int(kaima))

    def sosituseikaku_two_3(self):
        if self.ids.sositu_two_3.text=='素質':
            self.sositu_hosei_two_3=1
        else:
            pass
        if self.ids.seikaku_two_3.text=='性格':
            self.seikaku_hosei_two_3=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        else:
            pass

        if self.ids.monster_two_3.text=='攻撃モンスター':
            self.basic_status_two_3=status.default_m
        else:
            pass

        import math
        self.sosituseikaku_monster_two_3 = [math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[0]*self.basic_status_two_3[0]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[1]*self.basic_status_two_3[1]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[2]*self.basic_status_two_3[2]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[3]*self.basic_status_two_3[3]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[4]*self.basic_status_two_3[4]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[5]*self.basic_status_two_3[5]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[6]*self.basic_status_two_3[6]), math.ceil(self.sositu_hosei_two_3*self.seikaku_hosei_two_3[7]*self.basic_status_two_3[7]), self.basic_status_two_3[8], self.basic_status_two_3[9], self.basic_status_two_3[10], self.basic_status_two_3[11], self.basic_status_two_3[12], self.basic_status_two_3[13], self.basic_status_two_3[14], self.basic_status_two_3[15], self.basic_status_two_3[16], self.basic_status_two_3[17], self.basic_status_two_3[18], self.basic_status_two_3[19]] 
        print("final_status-wa",self.sosituseikaku_monster_two_3)
        tikara_3=str(self.sosituseikaku_monster_two_3[2])
        kouma_3=str(self.sosituseikaku_monster_two_3[4])
        kaima_3=str(self.sosituseikaku_monster_two_3[5])
        kiyou_3=str(self.sosituseikaku_monster_two_3[7])

        self.ids.calced_status_two_114.text=str(tikara_3)
        self.ids.calced_status_two_115.text=str(kouma_3)
        self.ids.calced_status_two_116.text=str(int(tikara_3)+int(kiyou_3))
        self.ids.calced_status_two_152.text=str(int(kaima_3))

    def sosituseikaku_two_2(self):
        if self.ids.sositu_two_2.text=='素質':
            self.sositu_hosei_two_2=1
        else:
            pass
        if self.ids.seikaku_two_2.text=='性格':
            self.seikaku_hosei_two_2=(1, 1, 1, 1, 1, 1, 1, 1, 0.5)
        else:
            pass

        if self.ids.monster_two_2.text=='守備モンスター':
            self.basic_status_two_2=status.default_m
        else:
            pass

        import math
        self.sosituseikaku_monster_two_2 = [math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[0]*self.basic_status_two_2[0]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[1]*self.basic_status_two_2[1]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[2]*self.basic_status_two_2[2]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[3]*self.basic_status_two_2[3]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[4]*self.basic_status_two_2[4]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[5]*self.basic_status_two_2[5]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[6]*self.basic_status_two_2[6]), math.ceil(self.sositu_hosei_two_2*self.seikaku_hosei_two_2[7]*self.basic_status_two_2[7]), self.basic_status_two_2[8], self.basic_status_two_2[9], self.basic_status_two_2[10], self.basic_status_two_2[11], self.basic_status_two_2[12], self.basic_status_two_2[13], self.basic_status_two_2[14], self.basic_status_two_2[15], self.basic_status_two_2[16], self.basic_status_two_2[17], self.basic_status_two_2[18], self.basic_status_two_2[19]] 
        HP=str(self.sosituseikaku_monster_two_2[0])
        mamori=str(self.sosituseikaku_monster_two_2[3])

        self.ids.calced_status_two_16.text=str(mamori)
        self.ids.calced_status_two_49.text=str(HP)
    
        self.ids.calced_status_two_17.text=str(math.floor(100*(1-self.basic_status_two_2[11])))
        self.ids.calced_status_two_18.text=str(math.floor(100*(1-self.basic_status_two_2[12])))
        self.ids.calced_status_two_19.text=str(math.floor(100*(1-self.basic_status_two_2[13])))
        self.ids.calced_status_two_20.text=str(math.floor(100*(1-self.basic_status_two_2[14])))
        self.ids.calced_status_two_21.text=str(math.floor(100*(1-self.basic_status_two_2[15])))
        self.ids.calced_status_two_22.text=str(math.floor(100*(1-self.basic_status_two_2[16])))
        self.ids.calced_status_two_23.text=str(math.floor(100*(1-self.basic_status_two_2[17])))
        self.ids.calced_status_two_24.text=str(math.floor(100*(1-self.basic_status_two_2[18])))

    def on_HP_selection_two_2(self, text):
        try:
            hp_text = self.ids.HP_1st.text if hasattr(self.ids, 'HP_1st') else '0'
            import re
            self.additional_HP = int(re.sub(r"\D", "", hp_text)) if hp_text else 0
        except (ValueError, AttributeError):
            self.additional_HP = 0

    def two_pan_rate(self):
        if self.ids.calced_status_two_26.text=='-':
            self.ids.calced_status_two_103.text='-'
        elif self.ids.calced_status_two_32.text=='-':
            self.ids.calced_status_two_103.text='-'
        else:
            target_hp = int(self.ids.calced_status_two_49.text)+self.additional_HP
            if self.ids.calced_status_two_26.text == '無効':
                minimum_damage_1 =0
            else:
                minimum_damage_1 = int(self.ids.calced_status_two_26.text)
            if self.ids.calced_status_two_30.text == '無効':
                max_damage_1 = 0
            else:
                max_damage_1 = int(self.ids.calced_status_two_30.text)
            if self.ids.calced_status_two_32.text == '無効':
                minimum_damage_2 = 0
            else:
                minimum_damage_2 = int(self.ids.calced_status_two_32.text)
            if self.ids.calced_status_two_36.text == '無効':
                max_damage_2 = 0
            else:
                max_damage_2 = int(self.ids.calced_status_two_36.text)

            damage_lst_1=[]
            damage_lst_2=[]
            for i in range(minimum_damage_1,max_damage_1+1):
                damage_lst_1.append(i)
            for i in range(minimum_damage_2,max_damage_2+1):
                damage_lst_2.append(i)

            all_damage_lst=[]
            for i in damage_lst_1:
                for j in damage_lst_2:
                    all_damage_lst.append(i + j)
            n = sum(x>=target_hp for x in all_damage_lst)
            print('kill_events are',n)
            print('all_events are',len(all_damage_lst))
            kill_rate=n/len(all_damage_lst)

            kill_rate=round(100*kill_rate,1)
            self.ids.calced_status_two_103.text=str(str(kill_rate) + str("%"))
            self.ids.calced_status_two_105.text=str('残HP')
            self.ids.calced_status_two_38.text=str(target_hp-max_damage_1-max_damage_2)
            self.ids.calced_status_two_40.text=str('~')
            self.ids.calced_status_two_42.text=str(target_hp-minimum_damage_1-minimum_damage_2)


class TaiseiSearchTab(BoxLayout):
    def __init__(self, root_widget=None, **kwargs):
        super(TaiseiSearchTab, self).__init__(**kwargs)
        self.bind(on_kv_post=self._on_kv_post)

    def _on_kv_post(self, base_widget, root_widget):
        choices = [
            '選択なし', 
            'メラ', 'ギラ', 'イオ', 'ヒャド', 'バギ', 'ジバ', 'デイン', 'ドルマ', 'ザバ',
            '眠り', '麻痺', '混乱', '幻惑', '毒', '即死', '呪い', '休み', '封印', '魅了'
        ]
        self.ids.attr_spinner_1.values = choices
        self.ids.attr_spinner_2.values = choices
        self.ids.attr_spinner_1.text = 'メラ'
        self.ids.attr_spinner_2.text = '選択なし'
        self.search_taisei()

    def search_taisei(self):
        attr1 = self.ids.attr_spinner_1.text
        attr2 = self.ids.attr_spinner_2.text

        element_list = ['メラ', 'ギラ', 'イオ', 'ヒャド', 'バギ', 'ジバ', 'デイン', 'ドルマ', 'ザバ']
        status_list = ['眠り', '麻痺', '混乱', '幻惑', '毒', '即死', '呪い', '休み', '封印', '魅了']

        attr_map = {
            'メラ': 11,
            'ギラ': 12,
            'イオ': 13,
            'ヒャド': 14,
            'バギ': 15,
            'ジバ': 16,
            'デイン': 17,
            'ドルマ': 18,
            'ザバ': 37,
            '眠り': 20,
            '麻痺': 21,
            '混乱': 22,
            '幻惑': 23,
            '毒': 24,
            '即死': 25,
            '呪い': 26,
            '休み': 27,
            '封印': 28,
            '魅了': 29
        }

        idx1 = attr_map.get(attr1)
        idx2 = attr_map.get(attr2)

        container = self.ids.results_container
        container.clear_widgets()

        # 両方「選択なし」の場合
        if idx1 is None and idx2 is None:
            from kivy.uix.label import Label
            msg = Label(text="耐性を選択してください（片方または両方）", font_size='16sp', size_hint_y=None, height=100)
            container.add_widget(msg)
            self.ids.header_col2.text = "-"
            self.ids.header_col3.text = "-"
            return

        def is_resistant(attr, val):
            if val is None:
                return False
            if attr in element_list:
                return val < 1.0
            elif attr in status_list:
                return val > 0
            return True

        def get_resistance_score(attr, val):
            if val is None:
                return 0.0
            if attr in element_list:
                return 1.0 - val
            elif attr in status_list:
                return val / 100.0
            return 0.0

        results = []
        for name in data.monster_lst:
            status_data = Generate_Monster.monster_selection(name)
            if status_data is not None:
                val1 = None
                val2 = None
                
                if idx1 is not None:
                    if idx1 < len(status_data):
                        val1 = status_data[idx1]
                    else:
                        val1 = 1.0 if attr1 in element_list else 0
                
                if idx2 is not None:
                    if idx2 < len(status_data):
                        val2 = status_data[idx2]
                    else:
                        val2 = 1.0 if attr2 in element_list else 0

                # 絞り込み条件（選択されている耐性の効果があること）
                match = True
                if idx1 is not None and not is_resistant(attr1, val1):
                    match = False
                if idx2 is not None and not is_resistant(attr2, val2):
                    match = False

                if match:
                    sort_key = 0.0
                    if val1 is not None:
                        sort_key += get_resistance_score(attr1, val1)
                    if val2 is not None:
                        sort_key += get_resistance_score(attr2, val2)

                    results.append({
                        'name': name,
                        'val1': val1,
                        'val2': val2,
                        'sort_key': sort_key
                    })

        # 耐性が高い順にソート（スコアが大きい順）
        results.sort(key=lambda x: x['sort_key'], reverse=True)

        from kivy.uix.boxlayout import BoxLayout
        from kivy.uix.label import Label
        from kivy.metrics import dp

        # ヘッダーのテキストを更新
        if idx1 is not None and idx2 is None:
            self.ids.header_col2.text = f"{attr1}（%）" if attr1 in element_list else attr1
            self.ids.header_col3.text = "判定"
        elif idx1 is None and idx2 is not None:
            self.ids.header_col2.text = f"{attr2}（%）" if attr2 in element_list else attr2
            self.ids.header_col3.text = "判定"
        else:
            self.ids.header_col2.text = f"{attr1}（%）" if attr1 in element_list else attr1
            self.ids.header_col3.text = f"{attr2}（%）" if attr2 in element_list else attr2

        # 耐性の種類を判定するヘルパー関数
        def get_label_and_color(attr, val):
            if val is None:
                return "", (1, 1, 1, 1)
            
            if attr in element_list:
                if val <= 0.5:
                    return "超耐性", (0.2, 0.7, 1.0, 1)  # 水色
                elif val < 1.0:
                    return "耐性", (0.3, 0.9, 0.3, 1)   # 緑
                elif val == 1.0:
                    return "等倍", (1, 1, 1, 1)         # 白
                elif val < 1.5:
                    return "弱点", (1.0, 0.7, 0.2, 1)   # オレンジ
                else:
                    return "超弱点", (1.0, 0.3, 0.3, 1)  # 赤
            elif attr in status_list:
                if val >= 100:
                    return "無効", (0.2, 0.7, 1.0, 1)  # 水色
                elif val >= 50:
                    return "超耐性", (0.3, 0.9, 0.3, 1) # 緑
                elif val >= 20:
                    return "耐性", (0.6, 0.9, 0.3, 1)  # 黄緑
                elif val > 0:
                    return "弱耐性", (0.8, 0.9, 0.8, 1) # 白緑
                else:
                    return "等倍", (1, 1, 1, 1)         # 白
            return "", (1, 1, 1, 1)

        # 耐性割合を表記に変換するヘルパー関数
        def format_value(attr, val):
            if val is None:
                return ""
            if attr in element_list:
                pct = round((val - 1.0) * 100, 2)
                if pct.is_integer():
                    pct = int(pct)
                if pct > 0:
                    return f"+{pct}%"
                elif pct < 0:
                    return f"{pct}%"
                else:
                    return "0%"
            elif attr in status_list:
                return f"{val}%"
            return str(val)

        # 各モンスターの行を追加
        for r in results:
            row = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(35), padding=[dp(10), 0])
            
            # 代表カラーの設定
            score1 = get_resistance_score(attr1, r['val1']) if r['val1'] is not None else -999.0
            score2 = get_resistance_score(attr2, r['val2']) if r['val2'] is not None else -999.0
            if score1 >= score2:
                _, color = get_label_and_color(attr1, r['val1'])
            else:
                _, color = get_label_and_color(attr2, r['val2'])
            
            # モンスター名
            name_lbl = Label(text=r['name'], font_size='15sp', size_hint_x=0.4, color=color, halign='left', valign='middle')
            name_lbl.bind(size=name_lbl.setter('text_size'))
            row.add_widget(name_lbl)

            if idx1 is not None and idx2 is None:
                # 耐性1のみ
                val_text = format_value(attr1, r['val1'])
                lbl_text, col1 = get_label_and_color(attr1, r['val1'])
                
                val_lbl = Label(text=val_text, font_size='15sp', size_hint_x=0.3, color=col1, halign='center', valign='middle')
                val_lbl.bind(size=val_lbl.setter('text_size'))
                row.add_widget(val_lbl)

                lbl_widget = Label(text=lbl_text, font_size='15sp', size_hint_x=0.3, color=col1, halign='center', valign='middle')
                lbl_widget.bind(size=lbl_widget.setter('text_size'))
                row.add_widget(lbl_widget)

            elif idx1 is None and idx2 is not None:
                # 耐性2のみ
                val_text = format_value(attr2, r['val2'])
                lbl_text, col2 = get_label_and_color(attr2, r['val2'])
                
                val_lbl = Label(text=val_text, font_size='15sp', size_hint_x=0.3, color=col2, halign='center', valign='middle')
                val_lbl.bind(size=val_lbl.setter('text_size'))
                row.add_widget(val_lbl)

                lbl_widget = Label(text=lbl_text, font_size='15sp', size_hint_x=0.3, color=col2, halign='center', valign='middle')
                lbl_widget.bind(size=lbl_widget.setter('text_size'))
                row.add_widget(lbl_widget)

            else:
                # 両方選択されている場合
                val_text1 = format_value(attr1, r['val1'])
                lbl_text1, col1 = get_label_and_color(attr1, r['val1'])
                
                val_text2 = format_value(attr2, r['val2'])
                lbl_text2, col2 = get_label_and_color(attr2, r['val2'])

                val1_lbl = Label(text=val_text1, font_size='15sp', size_hint_x=0.3, color=col1, halign='center', valign='middle')
                val1_lbl.bind(size=val1_lbl.setter('text_size'))
                row.add_widget(val1_lbl)

                val2_lbl = Label(text=val_text2, font_size='15sp', size_hint_x=0.3, color=col2, halign='center', valign='middle')
                val2_lbl.bind(size=val2_lbl.setter('text_size'))
                row.add_widget(val2_lbl)
            
            container.add_widget(row)


class GyakubikiTab(BoxLayout):
    def __init__(self, root_widget=None, **kwargs):
        super(GyakubikiTab, self).__init__(**kwargs)
        self.bind(on_kv_post=self._on_kv_post)

    def _on_kv_post(self, base_widget, root_widget):
        choices = ['全検索'] + data.monster_lst
        self.ids.monster_spinner.values = choices
        self.ids.monster_spinner.text = '全検索'

    def on_search(self):
        import math
        import itertools

        hp_text = self.ids.target_hp.text.strip()
        mp_text = self.ids.target_mp.text.strip()

        target_hp = int(hp_text) if hp_text.isdigit() else None
        target_mp = int(mp_text) if mp_text.isdigit() else None

        container = self.ids.results_container
        container.clear_widgets()

        if target_hp is None and target_mp is None:
            from kivy.uix.label import Label
            from kivy.metrics import dp
            msg = Label(text="目標HPまたは目標MPを入力してください。", font_size='16sp', size_hint_y=None, height=dp(50), color=(1, 0.3, 0.3, 1))
            container.add_widget(msg)
            return

        monster_spinner_text = self.ids.monster_spinner.text
        monster_filter = None if monster_spinner_text == '全検索' else monster_spinner_text

        include_lower = self.ids.include_lower_checkbox.active
        simple_mode = self.ids.simple_mode_checkbox.active

        # status.pyからモンスターデータベースを動的に構築
        monsters = {}
        for name in data.monster_lst:
            status_data = Generate_Monster.monster_selection(name)
            if status_data is not None:
                monsters[name] = {'HP': status_data[0], 'MP': status_data[1]}

        # 性格・素質リスト
        personalities = ['ぬけめがない', 'ちからじまん', 'おせっかい', 'むっつりすけべ', 'きれもの', 'ずのうめいせき', 'いっぴきおおかみ', 'おおぐらい']
        personalities_hp = {p: Generate_Monster.seikaku_selection(p)[0] for p in personalities}
        personalities_mp = {p: Generate_Monster.seikaku_selection(p)[1] for p in personalities}

        qualities = {"極": 1.0, "超": 0.92, "特": 0.85, "優": 0.8, "並": 0.75}
        excluded_qualities = ["特", "優", "並"]
        qualities_to_use = qualities if include_lower else {k: v for k, v in qualities.items() if k not in excluded_qualities}

        items_HP = {"HPS": 70, "HPA": 50, "HPB": 35, "HPC": 20, "HPD": 10}
        items_MP = {"MPS": 40, "MPA": 27, "MPB": 17, "MPC": 10, "MPD": 5}

        # 事前にアイテム組み合わせを生成
        hp_combinations = []
        for r in range(4):
            hp_combinations.extend(list(itertools.combinations_with_replacement(items_HP.keys(), r)))

        mp_combinations = []
        for r in range(4):
            mp_combinations.extend(list(itertools.combinations_with_replacement(items_MP.keys(), r)))

        # 逆引きサーチ関数
        result_hp = []
        if target_hp is not None:
            filtered_monsters = {k: v for k, v in monsters.items() if monster_filter is None or k == monster_filter}
            for monster_name, stats in filtered_monsters.items():
                base_hp = stats["HP"]
                for p_name, p_rate in personalities_hp.items():
                    for q_name, q_rate in qualities_to_use.items():
                        adjusted_hp = math.ceil(base_hp * p_rate * q_rate)
                        for item_combo in hp_combinations:
                            item_total = sum(items_HP[item] for item in item_combo)
                            if adjusted_hp + item_total == target_hp:
                                result_hp.append({
                                    "monster": monster_name,
                                    "personality": p_name,
                                    "quality": q_name,
                                    "items": item_combo
                                })

        result_mp = []
        if target_mp is not None:
            filtered_monsters = {k: v for k, v in monsters.items() if monster_filter is None or k == monster_filter}
            for monster_name, stats in filtered_monsters.items():
                base_mp = stats["MP"]
                for p_name, p_rate in personalities_mp.items():
                    for q_name, q_rate in qualities_to_use.items():
                        adjusted_mp = math.ceil(base_mp * p_rate * q_rate)
                        for item_combo in mp_combinations:
                            item_total = sum(items_MP[item] for item in item_combo)
                            if adjusted_mp + item_total == target_mp:
                                result_mp.append({
                                    "monster": monster_name,
                                    "personality": p_name,
                                    "quality": q_name,
                                    "items": item_combo
                                })

        matching_results = []
        if target_hp is not None and target_mp is not None:
            # 両方指定されている場合: O(N)マッチング
            mp_map = {}
            for res in result_mp:
                key = (res['monster'], res['personality'], res['quality'])
                if key not in mp_map:
                    mp_map[key] = []
                mp_map[key].append(res)

            for hp_res in result_hp:
                key = (hp_res['monster'], hp_res['personality'], hp_res['quality'])
                if key in mp_map:
                    for mp_res in mp_map[key]:
                        # HPとMPのアイテムの合計数が4未満か確認 (3個以下)
                        if len(hp_res['items']) + len(mp_res['items']) < 4:
                            matching_results.append({
                                "monster": hp_res['monster'],
                                "personality": hp_res['personality'],
                                "quality": hp_res['quality'],
                                "items_hp": hp_res['items'],
                                "items_mp": mp_res['items']
                            })

        # 最終表示用
        display_results = []
        if target_hp is not None and target_mp is not None:
            if matching_results:
                if simple_mode:
                    min_len = min(len(res['items_hp']) + len(res['items_mp']) for res in matching_results)
                    display_results = [res for res in matching_results if len(res['items_hp']) + len(res['items_mp']) == min_len]
                else:
                    display_results = matching_results
            else:
                # どちらか一方だけでも一致する結果を表示
                all_results = []
                for res in result_hp:
                    all_results.append({
                        "monster": res['monster'],
                        "personality": res['personality'],
                        "quality": res['quality'],
                        "items_hp": res['items'],
                        "items_mp": ()
                    })
                for res in result_mp:
                    all_results.append({
                        "monster": res['monster'],
                        "personality": res['personality'],
                        "quality": res['quality'],
                        "items_hp": (),
                        "items_mp": res['items']
                    })
                if all_results:
                    if simple_mode:
                        min_len = min(len(res['items_hp']) + len(res['items_mp']) for res in all_results)
                        display_results = [res for res in all_results if len(res['items_hp']) + len(res['items_mp']) == min_len]
                    else:
                        display_results = all_results
        elif target_hp is not None:
            if result_hp:
                if simple_mode:
                    min_len = min(len(res['items']) for res in result_hp)
                    display_results = [{
                        "monster": res['monster'],
                        "personality": res['personality'],
                        "quality": res['quality'],
                        "items_hp": res['items'],
                        "items_mp": ()
                    } for res in result_hp if len(res['items']) == min_len]
                else:
                    display_results = [{
                        "monster": res['monster'],
                        "personality": res['personality'],
                        "quality": res['quality'],
                        "items_hp": res['items'],
                        "items_mp": ()
                    } for res in result_hp]
        elif target_mp is not None:
            if result_mp:
                if simple_mode:
                    min_len = min(len(res['items']) for res in result_mp)
                    display_results = [{
                        "monster": res['monster'],
                        "personality": res['personality'],
                        "quality": res['quality'],
                        "items_hp": (),
                        "items_mp": res['items']
                    } for res in result_mp if len(res['items']) == min_len]
                else:
                    display_results = [{
                        "monster": res['monster'],
                        "personality": res['personality'],
                        "quality": res['quality'],
                        "items_hp": (),
                        "items_mp": res['items']
                    } for res in result_mp]

        if not display_results:
            from kivy.uix.label import Label
            from kivy.metrics import dp
            msg = Label(text="条件に合う結果は見つかりませんでした。", font_size='16sp', size_hint_y=None, height=dp(50))
            container.add_widget(msg)
            return

        # アイテム表示フォーマット
        def format_seeds(items, prefix):
            if not items:
                return "なし"
            return ",".join([item.replace(prefix, "") for item in items])

        from kivy.uix.label import Label
        from kivy.metrics import dp

        for r in display_results:
            row = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(35), padding=[dp(10), 0])
            
            color_map = {
                "極": (1.0, 0.85, 0.0, 1.0),
                "超": (0.7, 0.3, 1.0, 1.0),
                "特": (0.2, 0.6, 1.0, 1.0),
                "優": (0.3, 0.8, 0.3, 1.0),
                "並": (0.7, 0.7, 0.7, 1.0),
            }
            q_color = color_map.get(r['quality'], (1, 1, 1, 1))

            lbl_text = f"{r['quality']} {r['monster']} ({r['personality']})"
            lbl_candidate = Label(text=lbl_text, font_size='14sp', size_hint_x=0.6, color=q_color, halign='left', valign='middle')
            lbl_candidate.bind(size=lbl_candidate.setter('text_size'))
            row.add_widget(lbl_candidate)

            hp_seeds_str = format_seeds(r['items_hp'], "HP")
            mp_seeds_str = format_seeds(r['items_mp'], "MP")

            lbl_hp = Label(text=hp_seeds_str, font_size='14sp', size_hint_x=0.2, color=(1, 0.9, 0.9, 1) if hp_seeds_str != "なし" else (0.5, 0.5, 0.5, 1), halign='center', valign='middle')
            lbl_hp.bind(size=lbl_hp.setter('text_size'))
            row.add_widget(lbl_hp)

            lbl_mp = Label(text=mp_seeds_str, font_size='14sp', size_hint_x=0.2, color=(0.9, 0.9, 1, 1) if mp_seeds_str != "なし" else (0.5, 0.5, 0.5, 1), halign='center', valign='middle')
            lbl_mp.bind(size=lbl_mp.setter('text_size'))
            row.add_widget(lbl_mp)

            container.add_widget(row)

    def on_reset(self):
        self.ids.target_hp.text = ""
        self.ids.target_mp.text = ""
        self.ids.monster_spinner.text = "全検索"
        self.ids.include_lower_checkbox.active = False
        self.ids.simple_mode_checkbox.active = False
        self.ids.results_container.clear_widgets()


class MainApp(MDApp):

    def build(self):
        self.theme_cls.primary_palette = "Orange"
        self.theme_cls.theme_style = "Dark"
        return RootWidget()

if __name__ == '__main__':

    Builder.load_string('''
<TwoPanTab>:
    Button:
        text: "Launch TwoPan"
        on_release: root.open_twopan_popup()
''')
    MainApp().run()