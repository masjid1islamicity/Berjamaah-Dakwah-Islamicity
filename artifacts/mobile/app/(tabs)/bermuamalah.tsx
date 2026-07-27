import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
  FlatList, TextInput, Dimensions,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { MARKETPLACE_ITEMS, formatRupiah, type MarketplaceItem } from '@/data/islamicData';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 48) / 2;

// Nishab zakat maal 2026 (approx 85g emas × Rp 1.4jt/g)
const NISHAB_MAAL = 119_000_000;
// Nishab zakat profesi (bulanan) = Nishab maal / 12
const NISHAB_PROFESI = Math.round(NISHAB_MAAL / 12);
const ZAKAT_RATE = 0.025;
const ZAKAT_FITRAH_PER_JIWA = 45_000;

type ZakatType = 'maal' | 'profesi' | 'fitrah';

function ZakatCalculator() {
  const colors = useColors();
  const { addSedekah } = useApp();
  const [zakatType, setZakatType] = useState<ZakatType>('maal');
  const [wealth, setWealth] = useState('');
  const [jiwa, setJiwa] = useState('1');
  const [result, setResult] = useState<number | null>(null);
  const [belowNishab, setBelowNishab] = useState(false);

  const ZAKAT_TYPES: { id: ZakatType; label: string }[] = [
    { id: 'maal', label: 'Zakat Maal' },
    { id: 'profesi', label: 'Zakat Profesi' },
    { id: 'fitrah', label: 'Zakat Fitrah' },
  ];

  const calculate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (zakatType === 'fitrah') {
      const j = parseInt(jiwa, 10) || 1;
      setResult(j * ZAKAT_FITRAH_PER_JIWA);
      setBelowNishab(false);
      return;
    }
    const amount = parseInt(wealth.replace(/\D/g, ''), 10) || 0;
    const nishab = zakatType === 'maal' ? NISHAB_MAAL : NISHAB_PROFESI;
    if (amount < nishab) {
      setResult(0);
      setBelowNishab(true);
    } else {
      setResult(Math.round(amount * ZAKAT_RATE));
      setBelowNishab(false);
    }
  };

  const formatInput = (val: string) => {
    const digits = val.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Type selector */}
      <View style={[styles.segmented, { backgroundColor: colors.secondary }]}>
        {ZAKAT_TYPES.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.segmentBtn,
              zakatType === t.id && { backgroundColor: colors.card, ...styles.segmentActive },
            ]}
            onPress={() => { setZakatType(t.id); setResult(null); setBelowNishab(false); }}
          >
            <Text style={[styles.segmentText, { color: zakatType === t.id ? colors.primary : colors.mutedForeground }]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Info card */}
      <View style={[styles.infoCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        {zakatType === 'maal' && (
          <>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Nishab Zakat Maal (2026)</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>{formatRupiah(NISHAB_MAAL)}</Text>
            <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>Setara 85 gram emas murni</Text>
          </>
        )}
        {zakatType === 'profesi' && (
          <>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Nishab Zakat Profesi/Bulan</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>{formatRupiah(NISHAB_PROFESI)}</Text>
            <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>Dibayar dari penghasilan kotor bulanan</Text>
          </>
        )}
        {zakatType === 'fitrah' && (
          <>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Zakat Fitrah per Jiwa</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>{formatRupiah(ZAKAT_FITRAH_PER_JIWA)}</Text>
            <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>Setara 2.5 kg beras atau uang senilainya</Text>
          </>
        )}
      </View>

      {/* Input */}
      {zakatType !== 'fitrah' ? (
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.foreground }]}>
            {zakatType === 'maal' ? 'Total Harta (Rp)' : 'Penghasilan Bulanan (Rp)'}
          </Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.inputPrefix, { color: colors.mutedForeground }]}>Rp</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={wealth}
              onChangeText={(v) => setWealth(formatInput(v))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.foreground }]}>Jumlah Jiwa / Tanggungan</Text>
          <View style={[styles.stepper, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.stepperBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setJiwa((v) => String(Math.max(1, parseInt(v, 10) - 1)))}
            >
              <Feather name="minus" size={18} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.foreground }]}>{jiwa}</Text>
            <TouchableOpacity
              style={[styles.stepperBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setJiwa((v) => String(parseInt(v, 10) + 1))}
            >
              <Feather name="plus" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.calcBtn, { backgroundColor: colors.primary }]}
        onPress={calculate}
        activeOpacity={0.85}
      >
        <Text style={[styles.calcBtnText, { color: colors.primaryForeground }]}>Hitung Zakat</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={[styles.resultCard, { backgroundColor: belowNishab ? colors.secondary : colors.primary + '15', borderColor: belowNishab ? colors.border : colors.primary + '40' }]}>
          {belowNishab ? (
            <>
              <Feather name="info" size={20} color={colors.mutedForeground} />
              <Text style={[styles.resultTitle, { color: colors.mutedForeground }]}>Belum Wajib Zakat</Text>
              <Text style={[styles.resultSub, { color: colors.mutedForeground }]}>
                Harta belum mencapai nishab. Namun Anda tetap dianjurkan bersedekah.
              </Text>
            </>
          ) : (
            <>
              <Feather name="check-circle" size={20} color={colors.primary} />
              <Text style={[styles.resultTitle, { color: colors.primary }]}>Zakat yang Harus Dibayar</Text>
              <Text style={[styles.resultAmount, { color: colors.primary }]}>{formatRupiah(result)}</Text>
              <Text style={[styles.resultSub, { color: colors.mutedForeground }]}>
                Segera tunaikan zakatmu melalui LAZ terpercaya
              </Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function MarketplaceCard({ item }: { item: MarketplaceItem }) {
  const colors = useColors();
  return (
    <View style={[styles.shopCard, { backgroundColor: colors.card, borderColor: colors.border, width: ITEM_WIDTH }]}>
      <View style={[styles.shopImgPlaceholder, { backgroundColor: colors.secondary }]}>
        <Feather name="shopping-bag" size={28} color={colors.primary} />
      </View>
      {item.halalCertified && (
        <View style={[styles.halalBadge, { backgroundColor: '#1A7A4A' }]}>
          <Text style={styles.halalText}>Halal</Text>
        </View>
      )}
      <View style={styles.shopInfo}>
        <Text style={[styles.shopName, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.shopSeller, { color: colors.mutedForeground }]} numberOfLines={1}>{item.seller}</Text>
        <Text style={[styles.shopPrice, { color: colors.primary }]}>{formatRupiah(item.price)}</Text>
        <Text style={[styles.shopUnit, { color: colors.mutedForeground }]}>/{item.unit}</Text>
      </View>
    </View>
  );
}

export default function BermuamalahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'zakat' | 'pasar'>('zakat');

  const topPad = insets.top + WEB_TOP;
  const bottomPad = insets.bottom + (Platform.OS === 'web' ? 84 : 80);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Bermuamalah</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Transaksi & ibadah maaliyah</Text>

        <View style={[styles.tabBar, { backgroundColor: colors.secondary }]}>
          {(['zakat', 'pasar'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && { backgroundColor: colors.card, ...styles.tabBtnActive }]}
              onPress={() => { setActiveTab(tab); Haptics.selectionAsync(); }}
            >
              <Feather
                name={tab === 'zakat' ? 'percent' : 'shopping-bag'}
                size={14}
                color={activeTab === tab ? colors.primary : colors.mutedForeground}
              />
              <Text style={[styles.tabBtnText, { color: activeTab === tab ? colors.primary : colors.mutedForeground }]}>
                {tab === 'zakat' ? 'Zakat' : 'Pasar Halal'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'zakat' ? (
        <ScrollView
          contentContainerStyle={[styles.zakatContent, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ZakatCalculator />
        </ScrollView>
      ) : (
        <FlatList
          data={MARKETPLACE_ITEMS}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={[styles.shopContent, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <MarketplaceCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tabBar: { flexDirection: 'row', borderRadius: 12, padding: 4, marginTop: 14 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 10 },
  tabBtnActive: {
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  tabBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  zakatContent: { padding: 16 },
  shopContent: { padding: 16 },
  segmented: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
  segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  segmentActive: {
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  segmentText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  infoCard: {
    borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', marginBottom: 16,
  },
  infoLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 4 },
  infoSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 14, height: 50,
  },
  inputPrefix: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginRight: 6 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
  stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  stepperBtn: { padding: 14 },
  stepperValue: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Inter_700Bold' },
  calcBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  calcBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  resultCard: {
    borderRadius: 16, borderWidth: 1, padding: 20, alignItems: 'center', gap: 8,
  },
  resultTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  resultAmount: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  resultSub: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  shopCard: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  shopImgPlaceholder: { height: 100, alignItems: 'center', justifyContent: 'center' },
  halalBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  halalText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_700Bold' },
  shopInfo: { padding: 10, gap: 2 },
  shopName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', lineHeight: 18 },
  shopSeller: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  shopPrice: { fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 4 },
  shopUnit: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
