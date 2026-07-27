import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  Platform, Dimensions,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import {
  getDailyVerse,
  getPrayerTimesWithStatus,
  getNextPrayer,
  COMMUNITY_EVENTS,
  type PrayerTime,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
} from '@/data/islamicData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Assalamu\'alaikum';
  if (h < 17) return 'Assalamu\'alaikum';
  return 'Assalamu\'alaikum';
}

const PILLARS = [
  {
    id: 'dakwah',
    label: 'Berdakwah',
    icon: 'radio' as const,
    route: '/(tabs)/dakwah',
    bg: '#1A7A4A',
  },
  {
    id: 'syariah',
    label: 'Bersyariah',
    icon: 'book-open' as const,
    route: '/(tabs)/syariah',
    bg: '#1565A0',
  },
  {
    id: 'berjamaah',
    label: 'Berjamaah',
    icon: 'users' as const,
    route: '/(tabs)/berjamaah',
    bg: '#7B3F9E',
  },
  {
    id: 'bermuamalah',
    label: 'Bermuamalah',
    icon: 'briefcase' as const,
    route: '/(tabs)/bermuamalah',
    bg: '#B07A00',
  },
];

function PrayerTimeChip({ prayer, isNext }: { prayer: PrayerTime; isNext: boolean }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.prayerChip,
        {
          backgroundColor: isNext ? colors.primary : colors.card,
          borderColor: isNext ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={[styles.prayerArabic, { color: isNext ? 'rgba(255,255,255,0.8)' : colors.mutedForeground }]}>
        {prayer.arabicName}
      </Text>
      <Text style={[styles.prayerName, { color: isNext ? colors.primaryForeground : colors.foreground }]}>
        {prayer.name}
      </Text>
      <Text style={[styles.prayerTime, { color: isNext ? colors.primaryForeground : colors.primary }]}>
        {prayer.time}
      </Text>
    </View>
  );
}

export default function BerandaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const prayerTimes = getPrayerTimesWithStatus();
  const nextPrayer = getNextPrayer();
  const verse = getDailyVerse();
  const upcomingEvents = COMMUNITY_EVENTS.slice(0, 2);

  const topPad = insets.top + WEB_TOP;
  const bottomPad = insets.bottom + (Platform.OS === 'web' ? 84 : 80);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={['#0D5C38', '#1A7A4A']} style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{profile.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.avatarBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => router.push('/profil')}
          >
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {nextPrayer && (
          <View style={styles.nextPrayerBanner}>
            <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.nextPrayerText}>
              Shalat {nextPrayer.name} pukul {nextPrayer.time} WIB
            </Text>
          </View>
        )}

        {/* Prayer times scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.prayerScroll}
          contentContainerStyle={styles.prayerScrollContent}
        >
          {prayerTimes.map((p) => (
            <PrayerTimeChip key={p.name} prayer={p} isNext={p.name === nextPrayer?.name} />
          ))}
        </ScrollView>
      </LinearGradient>

      <View style={styles.body}>
        {/* Quran Verse */}
        <View style={[styles.verseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.verseHeader}>
            <View style={[styles.verseBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.verseBadgeText, { color: colors.primary }]}>
                {verse.surah} : {verse.ayat}
              </Text>
            </View>
            <Text style={[styles.verseLabel, { color: colors.mutedForeground }]}>Ayat Hari Ini</Text>
          </View>
          <Text style={[styles.arabicText, { color: colors.foreground }]}>{verse.arabic}</Text>
          <Text style={[styles.transliterationText, { color: colors.mutedForeground }]}>
            {verse.transliteration}
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.translationText, { color: colors.foreground }]}>
            "{verse.terjemahan}"
          </Text>
        </View>

        {/* 4B Pillars */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>4B Kaffah</Text>
        <View style={styles.pillarsGrid}>
          {PILLARS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.pillarCard, { backgroundColor: p.bg }]}
              onPress={() => router.push(p.route as any)}
              activeOpacity={0.85}
            >
              <Feather name={p.icon} size={26} color="#fff" />
              <Text style={styles.pillarLabel}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Events */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Kegiatan Jamaah</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/berjamaah')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        {upcomingEvents.map((ev) => (
          <View key={ev.id} style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.eventCardRow}>
              <View style={[styles.eventTypePill, { backgroundColor: EVENT_TYPE_COLORS[ev.type] + '22' }]}>
                <Text style={[styles.eventTypeText, { color: EVENT_TYPE_COLORS[ev.type] }]}>
                  {EVENT_TYPE_LABELS[ev.type]}
                </Text>
              </View>
            </View>
            <Text style={[styles.eventTitle, { color: colors.foreground }]} numberOfLines={2}>
              {ev.title}
            </Text>
            <View style={styles.eventMeta}>
              <Feather name="calendar" size={13} color={colors.mutedForeground} />
              <Text style={[styles.eventMetaText, { color: colors.mutedForeground }]}>{ev.dateLabel}</Text>
              <Feather name="map-pin" size={13} color={colors.mutedForeground} style={{ marginLeft: 8 }} />
              <Text style={[styles.eventMetaText, { color: colors.mutedForeground }]} numberOfLines={1}>
                {ev.location.split(',')[0]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  userName: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff', marginTop: 2 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
  nextPrayerBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 14, backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
  },
  nextPrayerText: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 13 },
  prayerScroll: { marginTop: 14 },
  prayerScrollContent: { gap: 8, paddingRight: 4 },
  prayerChip: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, minWidth: 72,
  },
  prayerArabic: { fontSize: 11, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  prayerName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  prayerTime: { fontSize: 13, fontFamily: 'Inter_700Bold', marginTop: 2 },
  body: { padding: 16, gap: 4 },
  verseCard: {
    borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  verseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  verseBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  verseBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  verseLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  arabicText: { fontSize: 22, textAlign: 'right', lineHeight: 40, fontFamily: 'Inter_400Regular', marginBottom: 6 },
  transliterationText: { fontSize: 12, fontFamily: 'Inter_400Regular', fontStyle: 'italic', marginBottom: 10 },
  divider: { height: 1, marginVertical: 10 },
  translationText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 12, marginBottom: 10 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  seeAll: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  pillarsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  pillarCard: {
    width: (SCREEN_WIDTH - 42) / 2, borderRadius: 14,
    padding: 18, alignItems: 'flex-start', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  pillarLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },
  eventCard: {
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  eventCardRow: { flexDirection: 'row', marginBottom: 8 },
  eventTypePill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  eventTypeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  eventTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', lineHeight: 22, marginBottom: 6 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventMetaText: { fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },
});
