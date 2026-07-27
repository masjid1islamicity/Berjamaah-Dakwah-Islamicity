import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

type FiqhTopic = {
  id: string;
  title: string;
  icon: string;
  color: string;
  subtopics: string[];
};

type FatwaQA = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const FIQH_TOPICS: FiqhTopic[] = [
  {
    id: 'thaharah',
    title: 'Thaharah',
    icon: 'droplet',
    color: '#2980B9',
    subtopics: ['Wudhu', 'Tayammum', 'Mandi Wajib', 'Najis & Hadats', 'Air & Hukumnya'],
  },
  {
    id: 'shalat',
    title: 'Shalat',
    icon: 'sunrise',
    color: '#1A7A4A',
    subtopics: ['Shalat Fardhu', 'Shalat Sunnah', 'Shalat Jamak & Qasar', 'Shalat Jumat', 'Shalat Jenazah'],
  },
  {
    id: 'puasa',
    title: 'Puasa',
    icon: 'moon',
    color: '#8E44AD',
    subtopics: ['Puasa Ramadhan', 'Puasa Sunnah', 'Fidyah & Kafarat', 'I\'tikaf', 'Zakat Fitrah'],
  },
  {
    id: 'zakat',
    title: 'Zakat',
    icon: 'gift',
    color: '#C9A84C',
    subtopics: ['Zakat Maal', 'Zakat Profesi', 'Zakat Pertanian', 'Zakat Emas & Perak', 'Mustahiq Zakat'],
  },
  {
    id: 'munakahat',
    title: 'Munakahat',
    icon: 'heart',
    color: '#E74C3C',
    subtopics: ['Syarat Nikah', 'Mahar', 'Wali Nikah', 'Talak & Khuluk', 'Hak & Kewajiban Suami Istri'],
  },
  {
    id: 'akhlak',
    title: 'Akhlak & Adab',
    icon: 'star',
    color: '#16A085',
    subtopics: ['Adab Sehari-hari', 'Akhlak Terhadap Orang Tua', 'Adab Bertetangga', 'Adab Bertamu', 'Adab Makan & Minum'],
  },
];

const FATWA_QA: FatwaQA[] = [
  {
    id: '1',
    question: 'Apakah sah shalat dengan pakaian yang terkena najis sedikit?',
    answer: 'Shalat dengan pakaian yang terkena najis tidak sah. Wajib menyucikan pakaian dari najis sebelum shalat. Namun bila najis sangat sedikit (ma\'fu) seperti percikan darah kecil yang sulit dihindari, para ulama berbeda pendapat, sebagian membolehkan.',
    category: 'Thaharah',
  },
  {
    id: '2',
    question: 'Bolehkah membaca Al-Quran melalui HP tanpa wudhu?',
    answer: 'Membaca Al-Quran melalui HP (smartphone/tablet) tanpa wudhu diperbolehkan menurut mayoritas ulama kontemporer, karena HP bukan mushaf. Namun sebaiknya tetap berwudhu untuk memuliakan kalam Allah.',
    category: 'Fiqh Kontemporer',
  },
  {
    id: '3',
    question: 'Hukum bekerja di perusahaan yang menjual produk haram?',
    answer: 'Bekerja di perusahaan yang produk utamanya haram (minuman keras, babi, dll) tidak diperbolehkan. Namun jika produk haramnya hanya sebagian kecil dan pekerjaan tidak terkait langsung dengan produk tersebut, para ulama berbeda pendapat.',
    category: 'Muamalah',
  },
  {
    id: '4',
    question: 'Apakah boleh shalat Jumat secara online?',
    answer: 'Mayoritas ulama tidak memperbolehkan shalat Jumat secara online karena syarat ijtima\' (berkumpul secara fisik) adalah rukun shalat Jumat. Shalat Jumat online tidak memenuhi syarat berjamaah yang hakiki.',
    category: 'Shalat',
  },
  {
    id: '5',
    question: 'Hukum investasi saham dalam Islam?',
    answer: 'Investasi saham syariah diperbolehkan dengan syarat: perusahaan tidak bergerak di bidang yang diharamkan, tidak mengandung riba, gharar berlebihan, dan maisir. Ada Dewan Pengawas Syariah (DPS) yang mengevaluasi kehalalan saham.',
    category: 'Muamalah',
  },
];

function TopicCard({ topic, expanded, onPress }: {
  topic: FiqhTopic;
  expanded: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.topicCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity style={styles.topicHeader} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
          <Feather name={topic.icon as any} size={18} color={topic.color} />
        </View>
        <Text style={[styles.topicTitle, { color: colors.foreground }]}>{topic.title}</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.subtopicsContainer, { borderTopColor: colors.border }]}>
          {topic.subtopics.map((sub, i) => (
            <View key={i} style={[styles.subtopicRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.subtopicDot, { backgroundColor: topic.color }]} />
              <Text style={[styles.subtopicText, { color: colors.foreground }]}>{sub}</Text>
              <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function FatwaCard({ qa }: { qa: FatwaQA }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[styles.fatwaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        onPress={() => {
          setExpanded((e) => !e);
          Haptics.selectionAsync();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.fatwaHeader}>
          <View style={[styles.qBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.qText}>T</Text>
          </View>
          <Text style={[styles.fatwaQuestion, { color: colors.foreground }]} numberOfLines={expanded ? undefined : 2}>
            {qa.question}
          </Text>
        </View>
        {expanded && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.fatwaAnswer}>
              <View style={[styles.qBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.qText}>J</Text>
              </View>
              <Text style={[styles.fatwaAnswerText, { color: colors.foreground }]}>{qa.answer}</Text>
            </View>
            <View style={[styles.fatwaCategoryPill, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.fatwaCategoryText, { color: colors.primary }]}>{qa.category}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function SyariahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fiqh' | 'fatwa'>('fiqh');

  const topPad = insets.top + WEB_TOP;
  const bottomPad = insets.bottom + (Platform.OS === 'web' ? 84 : 80);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Bersyariah</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Panduan syariah Islam kaffah</Text>

        <View style={[styles.tabBar, { backgroundColor: colors.secondary }]}>
          {(['fiqh', 'fatwa'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && { backgroundColor: colors.card, ...styles.tabBtnActive }]}
              onPress={() => {
                setActiveTab(tab);
                Haptics.selectionAsync();
              }}
            >
              <Text style={[styles.tabBtnText, { color: activeTab === tab ? colors.primary : colors.mutedForeground }]}>
                {tab === 'fiqh' ? 'Materi Fiqh' : 'Tanya Jawab'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'fiqh' ? (
          <>
            <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.primary + '40' }]}>
              <Feather name="info" size={14} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.secondaryForeground }]}>
                Panduan fiqh berdasarkan Mazhab Syafi\'i — mazhab utama mayoritas Muslim Indonesia
              </Text>
            </View>
            {FIQH_TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                expanded={expandedTopic === topic.id}
                onPress={() => {
                  setExpandedTopic(expandedTopic === topic.id ? null : topic.id);
                  Haptics.selectionAsync();
                }}
              />
            ))}
          </>
        ) : (
          <>
            <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.primary + '40' }]}>
              <Feather name="info" size={14} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.secondaryForeground }]}>
                Kumpulan tanya jawab fiqh dari para ulama — klik pertanyaan untuk melihat jawaban
              </Text>
            </View>
            {FATWA_QA.map((qa) => (
              <FatwaCard key={qa.id} qa={qa} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tabBar: { flexDirection: 'row', borderRadius: 12, padding: 4, marginTop: 14 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: {
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  tabBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16, gap: 10 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 4,
  },
  infoText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18, flex: 1 },
  topicCard: {
    borderRadius: 14, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  topicHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  topicIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topicTitle: { flex: 1, fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  subtopicsContainer: { borderTopWidth: 1, paddingHorizontal: 14, paddingBottom: 8 },
  subtopicRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subtopicDot: { width: 6, height: 6, borderRadius: 3 },
  subtopicText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  fatwaCard: {
    borderRadius: 14, borderWidth: 1, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  fatwaHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  qBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  qText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#fff' },
  fatwaQuestion: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold', lineHeight: 21 },
  divider: { height: 1, marginVertical: 12 },
  fatwaAnswer: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  fatwaAnswerText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  fatwaCategoryPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 10 },
  fatwaCategoryText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
