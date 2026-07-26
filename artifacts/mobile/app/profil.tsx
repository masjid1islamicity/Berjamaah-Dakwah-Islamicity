import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/lib/auth';
import { formatRupiah } from '@/data/islamicData';

/* ------------------------------------------------------------------ */
/*  Login / unauthenticated gate                                       */
/* ------------------------------------------------------------------ */
function LoginGate({ colors, insets }: { colors: any; insets: any }) {
  const { login, isLoading } = useAuth();

  return (
    <View style={[loginStyles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom + 32 }]}>
      {/* Islamic decorative top */}
      <View style={[loginStyles.hero, { backgroundColor: colors.primary }]}>
        <Text style={loginStyles.heroArabic}>بِسْمِ اللَّهِ</Text>
        <View style={[loginStyles.avatarPlaceholder, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Feather name="user" size={40} color="#fff" />
        </View>
        <Text style={loginStyles.heroTitle}>Selamat Datang di ABDI</Text>
        <Text style={loginStyles.heroSub}>Aplikasi Berjamaah Dakwah Islamicity</Text>
      </View>

      <View style={loginStyles.body}>
        <Text style={[loginStyles.heading, { color: colors.foreground }]}>Masuk untuk Melanjutkan</Text>
        <Text style={[loginStyles.subheading, { color: colors.mutedForeground }]}>
          Simpan progres, daftar kegiatan jamaah, catat sedekah, dan akses fitur lengkap ABDI.
        </Text>

        {/* Feature bullets */}
        {[
          { icon: 'bookmark', text: 'Simpan konten dakwah favorit' },
          { icon: 'calendar', text: 'Daftar kegiatan berjamaah' },
          { icon: 'heart', text: 'Catat sedekah & amal harian' },
          { icon: 'users', text: 'Bergabung komunitas Muslim' },
        ].map(({ icon, text }) => (
          <View key={icon} style={loginStyles.featureRow}>
            <View style={[loginStyles.featureIcon, { backgroundColor: colors.primary + '18' }]}>
              <Feather name={icon as any} size={16} color={colors.primary} />
            </View>
            <Text style={[loginStyles.featureText, { color: colors.foreground }]}>{text}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[loginStyles.loginBtn, { backgroundColor: colors.primary }]}
          onPress={login}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="log-in" size={18} color="#fff" />
              <Text style={loginStyles.loginBtnText}>Masuk / Daftar</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={[loginStyles.disclaimer, { color: colors.mutedForeground }]}>
          Dengan masuk, Anda menyetujui syarat & ketentuan penggunaan ABDI.
        </Text>
      </View>
    </View>
  );
}

const loginStyles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24,
    alignItems: 'center', gap: 12,
  },
  heroArabic: { fontSize: 22, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  avatarPlaceholder: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center', marginVertical: 8,
  },
  heroTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff', textAlign: 'center' },
  heroSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  body: { padding: 24, gap: 0 },
  heading: { fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 8 },
  subheading: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  featureIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 14, fontFamily: 'Inter_500Medium', flex: 1 },
  loginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 16, marginTop: 16, marginBottom: 12,
  },
  loginBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  disclaimer: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 18 },
});

/* ------------------------------------------------------------------ */
/*  Authenticated profile screen                                       */
/* ------------------------------------------------------------------ */
export default function ProfilScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { profile, updateProfile, bookmarkedIds, registeredEventIds, sedekahTotal, addSedekah } = useApp();
  const [editModal, setEditModal] = useState(false);
  const [sedekahModal, setSedekahModal] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftCity, setDraftCity] = useState(profile.city);
  const [draftMasjid, setDraftMasjid] = useState(profile.masjid);
  const [sedekahAmount, setSedekahAmount] = useState('');

  // Still loading auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <LoginGate colors={colors} insets={insets} />;
  }

  // Use real name from auth, fall back to local profile
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : profile.name;

  const initials = displayName
    .split(' ')
    .map((w: string) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const STATS = [
    { icon: 'bookmark', label: 'Konten Tersimpan', value: `${bookmarkedIds.length} artikel`, onPress: () => {} },
    { icon: 'calendar', label: 'Kegiatan Terdaftar', value: `${registeredEventIds.length} kegiatan`, onPress: () => {} },
    { icon: 'heart', label: 'Total Sedekah', value: formatRupiah(sedekahTotal), onPress: () => setSedekahModal(true) },
  ];

  const MENU = [
    { icon: 'bell', label: 'Notifikasi Shalat', onPress: () => {} },
    { icon: 'map-pin', label: 'Ubah Lokasi Kota', onPress: () => setEditModal(true) },
    { icon: 'info', label: 'Tentang ABDI', onPress: () => Alert.alert('ABDI', 'Aplikasi Berjamaah Dakwah Islamicity\nVersi 1.0.0\n\n4B Kaffah: Berdakwah, Bersyariah, Berjamaah, Bermuamalah') },
    {
      icon: 'log-out',
      label: 'Keluar',
      onPress: () => Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: logout },
      ]),
    },
  ];

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileSection, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.foreground }]}>{displayName}</Text>
          {user?.email ? (
            <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>{user.email}</Text>
          ) : null}
          <View style={styles.profileMeta}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={[styles.profileMetaText, { color: colors.mutedForeground }]}>{profile.city}</Text>
            {profile.masjid ? (
              <>
                <Text style={[styles.profileMetaText, { color: colors.mutedForeground }]}> • </Text>
                <Feather name="home" size={13} color={colors.mutedForeground} />
                <Text style={[styles.profileMetaText, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {' '}{profile.masjid}
                </Text>
              </>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.editBtn, { borderColor: colors.border }]}
            onPress={() => {
              setDraftName(profile.name);
              setDraftCity(profile.city);
              setDraftMasjid(profile.masjid);
              setEditModal(true);
            }}
          >
            <Feather name="edit-2" size={14} color={colors.primary} />
            <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Aktivitas Saya</Text>
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={s.onPress}
            >
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '18' }]}>
                <Feather name={s.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bismillah Banner */}
        <View style={[styles.bismillahBanner, { backgroundColor: colors.primary }]}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
          <Text style={styles.bismillahSub}>ABDI — 4B Kaffah untuk Umat</Text>
        </View>

        {/* Menu */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pengaturan</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {MENU.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuRow,
                i < MENU.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
              onPress={() => { m.onPress(); Haptics.selectionAsync(); }}
            >
              <View style={[
                styles.menuIcon,
                { backgroundColor: m.icon === 'log-out' ? colors.destructive + '15' : colors.secondary },
              ]}>
                <Feather
                  name={m.icon as any}
                  size={16}
                  color={m.icon === 'log-out' ? colors.destructive ?? '#E53E3E' : colors.primary}
                />
              </View>
              <Text style={[
                styles.menuLabel,
                { color: m.icon === 'log-out' ? colors.destructive ?? '#E53E3E' : colors.foreground },
              ]}>
                {m.label}
              </Text>
              {m.icon !== 'log-out' && <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Edit Profil Modal */}
      <Modal visible={editModal} animationType="slide" presentationStyle="formSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit Profil</Text>
            <TouchableOpacity onPress={() => setEditModal(false)}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          {[
            { label: 'Nama Tampilan', val: draftName, set: setDraftName },
            { label: 'Kota', val: draftCity, set: setDraftCity },
            { label: 'Masjid / Halaqah', val: draftMasjid, set: setDraftMasjid },
          ].map(({ label, val, set }) => (
            <View key={label} style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>{label}</Text>
              <TextInput
                value={val}
                onChangeText={set}
                style={[styles.formInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                placeholderTextColor={colors.mutedForeground}
                placeholder={label}
              />
            </View>
          ))}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              updateProfile({ name: draftName, city: draftCity, masjid: draftMasjid });
              setEditModal(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          >
            <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Sedekah Modal */}
      <Modal visible={sedekahModal} animationType="slide" presentationStyle="formSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Catat Sedekah</Text>
            <TouchableOpacity onPress={() => setSedekahModal(false)}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.totalSedekah, { color: colors.primary }]}>
            Total: {formatRupiah(sedekahTotal)}
          </Text>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>Jumlah Sedekah (Rp)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.inputPrefix, { color: colors.mutedForeground }]}>Rp</Text>
              <TextInput
                value={sedekahAmount}
                onChangeText={(v) => setSedekahAmount(v.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
                style={[styles.formInput2, { color: colors.foreground }]}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              const amount = parseInt(sedekahAmount.replace(/\D/g, ''), 10) || 0;
              if (amount > 0) {
                addSedekah(amount);
                setSedekahAmount('');
                setSedekahModal(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }}
          >
            <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>Catat Sedekah</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSection: {
    alignItems: 'center', paddingTop: 32, paddingBottom: 24,
    paddingHorizontal: 20, borderBottomWidth: 1,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileName: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 6 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  profileMetaText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  editBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  statCard: {
    flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 13, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  statLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  bismillahBanner: {
    margin: 20, borderRadius: 16, padding: 20, alignItems: 'center', gap: 6,
  },
  bismillah: { fontSize: 20, color: '#fff', fontFamily: 'Inter_400Regular' },
  bismillahSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  menuCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  modal: { flex: 1, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  totalSedekah: { fontSize: 22, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBool', marginBottom: 6 },
  formInput: {
    height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14,
    fontSize: 15, fontFamily: 'Inter_400Regular',
  },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 48 },
  inputPrefix: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginRight: 6 },
  formInput2: { flex: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
  saveBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
});
