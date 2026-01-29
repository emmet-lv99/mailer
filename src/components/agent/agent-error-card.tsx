import { AlertCircle, Clock, Lock, SearchX } from "lucide-react";

interface AgentErrorCardProps {
    error: {
        code: string;
        message: string;
    };
}

export function AgentErrorCard({ error }: AgentErrorCardProps) {
    const getErrorStyle = (code: string) => {
        switch (code) {
            case "ACCOUNT_NOT_FOUND":
                return {
                    icon: <SearchX className="w-5 h-5 text-red-500" />,
                    title: "계정을 찾을 수 없습니다",
                    desc: "입력하신 계정이 존재하지 않거나 삭제되었습니다.",
                    bg: "bg-red-50",
                    border: "border-red-200"
                };
            case "PRIVATE_ACCOUNT":
                return {
                    icon: <Lock className="w-5 h-5 text-orange-500" />,
                    title: "비공개 계정입니다",
                    desc: "비공개 계정은 분석할 수 없습니다. 공개로 전환 후 시도해주세요.",
                    bg: "bg-orange-50",
                    border: "border-orange-200"
                };
            case "RATE_LIMIT":
                return {
                    icon: <Clock className="w-5 h-5 text-yellow-600" />,
                    title: "요청 한도 초과",
                    desc: "너무 많은 요청이 발생했습니다. 5분 후 다시 시도해주세요.",
                    bg: "bg-yellow-50",
                    border: "border-yellow-200"
                };
            default:
                return {
                    icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
                    title: "일시적 오류 발생",
                    desc: error.message || "서버 오류로 분석을 완료하지 못했습니다.",
                    bg: "bg-gray-50",
                    border: "border-gray-200"
                };
        }
    };

    const style = getErrorStyle(error.code);

    return (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${style.bg} ${style.border} max-w-sm`}>
            <div className="shrink-0 mt-0.5">{style.icon}</div>
            <div>
                <h4 className="font-bold text-sm text-slate-800 mb-1">{style.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{style.desc}</p>
            </div>
        </div>
    );
}
