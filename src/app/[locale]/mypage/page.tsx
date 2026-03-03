"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { Link } from "@/i18n/navigation";
import { deleteAccount } from "@/lib/server/profile-actions";
import { User, FileText, CreditCard, Crown, ChevronRight, Trash2, AlertTriangle } from "lucide-react";

const MENU_ITEMS = [
  { key: "profile", href: "/mypage/profile", icon: User, labelKey: "profile" },
  { key: "payments", href: "/mypage/payments", icon: CreditCard, labelKey: "paymentHistory" },
  { key: "subscription", href: "/mypage/subscription", icon: Crown, labelKey: "subscription" },
] as const;

export default function MyPage() {
  const t = useTranslations("MyPage");
  const { data: session } = useSession();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const displayName = session?.user?.name || session?.user?.email?.split("@")[0] || "";

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      await signOut({ callbackUrl: "/" });
    }
    setDeleting(false);
  };

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <GoldFrame size="lg">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User size={36} className="text-gold-500" strokeWidth={1.5} />
          )}
        </GoldFrame>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gold-300">{displayName}</h2>
          <p className="text-sm text-gold-600 mt-1">{session?.user?.email}</p>
        </div>

        <div className="w-full space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.href}>
                <GoldCard variant="interactive" className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-gold-400" strokeWidth={1.5} />
                    <span className="text-sm text-gold-300">{t(item.labelKey)}</span>
                  </div>
                  <ChevronRight size={16} className="text-gold-600" />
                </GoldCard>
              </Link>
            );
          })}
        </div>

        {/* Account Deletion */}
        <div className="w-full pt-8 border-t border-gold-600/10">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm text-red-400/60 hover:text-red-400 transition-colors mx-auto"
            >
              <Trash2 size={14} />
              계정 삭제
            </button>
          ) : (
            <GoldCard className="border-red-500/30 bg-red-900/10">
              <div className="flex flex-col items-center gap-3 py-2">
                <AlertTriangle size={24} className="text-red-400" />
                <p className="text-sm text-red-400 text-center font-medium">
                  정말 계정을 삭제하시겠습니까?
                </p>
                <p className="text-xs text-red-400/60 text-center">
                  모든 데이터가 영구적으로 삭제됩니다.
                </p>
                <div className="flex gap-3 mt-1">
                  <GoldButton variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                    취소
                  </GoldButton>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="px-4 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {deleting ? "삭제 중..." : "삭제 확인"}
                  </button>
                </div>
              </div>
            </GoldCard>
          )}
        </div>
      </div>
    </div>
  );
}
