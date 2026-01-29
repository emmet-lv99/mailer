import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getProxiedUrl } from "@/services/instagram/utils";
import { CheckCircle2, Users } from "lucide-react";

interface ProfileCardProps {
  data: {
    username: string;
    fullName: string;
    followers: number;
    followersCount?: number;
    biography: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
}

export function ProfileCard({ data }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm mt-3 border-purple-100 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-purple-100">
            <AvatarImage 
                src={getProxiedUrl(data.profilePicUrl)} 
                alt={data.username}
                className="object-cover"
            />
            <AvatarFallback>{(data.username || "IG").substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg flex items-center gap-1.5 text-gray-900 truncate">
              {data.fullName}
              {data.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-white" />}
            </h4>
            <a 
                href={`https://www.instagram.com/${data.username}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-sm text-gray-500 truncate font-medium hover:text-purple-600 hover:underline transition-colors block w-fit"
            >
                @{data.username}
            </a>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
              <Users className="w-3.5 h-3.5" />
              <span>{(data.followers || data.followersCount || 0).toLocaleString()} Followers</span>
            </div>
          </div>
        </div>

        {data.biography && (
          <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-md whitespace-pre-wrap break-all">
            {data.biography}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
