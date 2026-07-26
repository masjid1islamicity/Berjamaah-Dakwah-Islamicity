import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { DAKWAH_CONTENTS, type DakwahContent } from '@/data/islamicData';

const CATEGORIES = ['Semua', 'Aqidah', 'Fiqh', 'Akhlak', 'Sirah', 'Quran', 'Umum'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<string, string> = {
  Aqidah: '#8E44AD',
  Fiqh: '#1A7A4A',
  Akhlak: '#2980B9',
  Sirah: '#E67E22',
  Quran: '#C0392B',
  Umum: '#7F8C8D',
};

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

function DakwahCard({ item, isBookmarked, onToggle }: {
  item: DakwahContent;
  isBookmarked: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();
  const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryPill, { backgroundColor: catColor + '20' }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>{item.category}</Text>
        </View>
        <TouchableOpacity onPress={onToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather
            name={isBookmarked ? 'bookmark' : 'bookmark'}
            size={18}
            color={isBookmarked ? colors.accent : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={[styles.cardExcerpt, { color: colors.mutedForeground }]} numberOfLines={3}>
        {item.excerpt}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.cardMeta}>
          <Feather name="user" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.author}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Feather name="clock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.readMinutes} menit</Text>
        </View>
        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.date}</Text>
      </View>
    </View>
  );
}

export default function DakwahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isBookmarked, toggleBookmark } = useApp();
  const [selectedCat, setSelectedCat] = useState<Category>('Semua');

  const filtered = useMemo(() => {
    if (selectedCat === 'Semua') return DAKWAH_CONTENTS;
    return DAKWAH_CONTENTS.filter((d) => d.category === selectedCat);
  }, [selectedCat]);

  const topPad = insets.top + WEB_TOP;
  const bottomPad = insets.bottom + (Platform.OS === 'web' ? 84 : 80);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Berdakwah</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Sebarkan kebaikan dan ilmu</Text>

        {/* Category chips */}
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryContent}
          renderItem={({ item }) => {
            const active = item === selectedCat;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active ? colors.primary : colors.secondary,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  setSelectedCat(item);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[styles.categoryChipText, { color: active ? colors.primaryForeground : colors.foreground }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Belum ada konten di kategori ini
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <DakwahCard
            item={item}
            isBookmarked={isBookmarked(item.id)}
            onToggle={() => {
              toggleBookmark(item.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  categoryList: { marginTop: 14 },
  categoryContent: { gap: 8, paddingRight: 4 },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  categoryChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  listContent: { padding: 16 },
  card: {
    borderRadius: 16, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  categoryText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  cardTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', lineHeight: 22, marginBottom: 6 },
  cardExcerpt: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
