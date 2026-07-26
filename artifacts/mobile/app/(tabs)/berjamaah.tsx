import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import {
  COMMUNITY_EVENTS,
  type CommunityEvent,
  EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
} from '@/data/islamicData';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

function CapacityBar({ registered, capacity, color }: { registered: number; capacity: number; color: string }) {
  const colors = useColors();
  const pct = Math.min(registered / capacity, 1);
  return (
    <View style={[styles.capBar, { backgroundColor: colors.secondary }]}>
      <View style={[styles.capFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

function EventCard({ ev }: { ev: CommunityEvent }) {
  const colors = useColors();
  const { isRegistered, toggleEventRegistration } = useApp();
  const registered = isRegistered(ev.id);
  const typeColor = EVENT_TYPE_COLORS[ev.type];
  const remaining = ev.capacity - ev.registered;
  const full = remaining <= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.typePill, { backgroundColor: typeColor + '22' }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>{EVENT_TYPE_LABELS[ev.type]}</Text>
        </View>
        {registered && (
          <View style={[styles.registeredBadge, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="check" size={11} color={colors.primary} />
            <Text style={[styles.registeredText, { color: colors.primary }]}>Terdaftar</Text>
          </View>
        )}
      </View>

      <Text style={[styles.cardTitle, { color: colors.foreground }]}>{ev.title}</Text>
      <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
        {ev.description}
      </Text>

      <View style={styles.metaRow}>
        <Feather name="calendar" size={13} color={colors.mutedForeground} />
        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{ev.dateLabel} • {ev.time}</Text>
      </View>
      <View style={styles.metaRow}>
        <Feather name="map-pin" size={13} color={colors.mutedForeground} />
        <Text style={[styles.metaText, { color: colors.mutedForeground }]} numberOfLines={1}>{ev.location}</Text>
      </View>

      <View style={styles.capacityRow}>
        <Text style={[styles.capText, { color: colors.mutedForeground }]}>
          {ev.registered}/{ev.capacity} peserta
        </Text>
        {!full && (
          <Text style={[styles.remainText, { color: typeColor }]}>{remaining} tempat tersisa</Text>
        )}
        {full && (
          <Text style={[styles.remainText, { color: colors.destructive }]}>Penuh</Text>
        )}
      </View>
      <CapacityBar registered={ev.registered} capacity={ev.capacity} color={typeColor} />

      <TouchableOpacity
        style={[
          styles.registerBtn,
          {
            backgroundColor: registered
              ? colors.secondary
              : full
              ? colors.muted
              : typeColor,
          },
        ]}
        onPress={() => {
          if (!full || registered) {
            toggleEventRegistration(ev.id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }}
        disabled={full && !registered}
      >
        <Feather
          name={registered ? 'user-check' : 'user-plus'}
          size={15}
          color={registered ? colors.foreground : full ? colors.mutedForeground : '#fff'}
        />
        <Text
          style={[
            styles.registerBtnText,
            { color: registered ? colors.foreground : full ? colors.mutedForeground : '#fff' },
          ]}
        >
          {registered ? 'Batalkan Pendaftaran' : full ? 'Kuota Penuh' : 'Daftar Sekarang'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BerjamaahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { registeredEventIds } = useApp();

  const topPad = insets.top + WEB_TOP;
  const bottomPad = insets.bottom + (Platform.OS === 'web' ? 84 : 80);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Berjamaah</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Kegiatan komunitas & jamaah
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: colors.primary + '18' }]}>
            <Feather name="calendar" size={13} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.primary }]}>
              {COMMUNITY_EVENTS.length} Kegiatan
            </Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.accent + '18' }]}>
            <Feather name="check-circle" size={13} color={colors.accent} />
            <Text style={[styles.statText, { color: colors.accent }]}>
              {registeredEventIds.length} Terdaftar
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={COMMUNITY_EVENTS}
        keyExtractor={(e) => e.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="calendar" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Belum ada kegiatan
            </Text>
          </View>
        }
        renderItem={({ item }) => <EventCard ev={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  listContent: { padding: 16 },
  card: {
    borderRadius: 16, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 8, marginBottom: 10, alignItems: 'center' },
  typePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  typeText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  registeredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  registeredText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  cardTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', lineHeight: 22, marginBottom: 6 },
  cardDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },
  capacityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 6 },
  capText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  remainText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  capBar: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 14 },
  capFill: { height: '100%', borderRadius: 2 },
  registerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 12,
  },
  registerBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
