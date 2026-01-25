import { cn } from "@/lib/utils";
import { LayoutBlock } from "@/services/mall/types";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
import { DetailPreview, FooterPreview } from "./previews/DetailFooterPreviews";
import { HeaderPreview, TopBannerPreview } from "./previews/HeaderBannerPreviews";
import { HeroPreview, SubBannerPreview } from "./previews/HeroSubPreviews";
import { CategoryProductPreview, ProductListPreview } from "./previews/ProductCategoryPreviews";
import { SectionHeaderPreview, VideoPreview } from "./previews/VideoSectionPreviews";

interface LayoutBlockPreviewProps {
    block: LayoutBlock;
    borderRadius: string;
    onRemove: (id: string) => void;
}

export function LayoutBlockPreview({ block, borderRadius, onRemove }: LayoutBlockPreviewProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const sortableStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleRemove = () => onRemove(block.id);

    const isFullWidth = [
        'full-scroll', 'image-strap', 'full-video', 'full-image', 'carousel-center'
    ].includes(block.type);

    const baseClasses = cn(
        "relative group shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 w-full",
    );

    const DragHandle = () => (
        <div 
            {...attributes} 
            {...listeners} 
            className="absolute -left-5 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-all"
        >
            <GripVertical className="w-4 h-4" />
        </div>
    );

    const renderBlock = () => {
        const props = { block, borderRadius, isFullWidth, baseClasses, handleRemove };
        
        switch (block.category) {
            case 'header': return <HeaderPreview {...props} />;
            case 'top-banner': return <TopBannerPreview {...props} />;
            case 'hero': return <HeroPreview {...props} />;
            case 'sub': return <SubBannerPreview {...props} />;
            case 'product-list': return <ProductListPreview {...props} />;
            case 'category-product': return <CategoryProductPreview {...props} />;
            case 'shorts':
            case 'video-product': return <VideoPreview {...props} />;
            case 'detail': return <DetailPreview {...props} />;
            case 'section-header': return <SectionHeaderPreview {...props} />;
            case 'footer': return <FooterPreview {...props} />;
            default: return null;
        }
    };

    const blockContent = renderBlock();
    if (!blockContent) return null;

    return (
        <div
            ref={setNodeRef}
            style={sortableStyle}
            className={cn(
                "relative group",
                isFullWidth ? "w-full mx-0" : "px-6",
                isDragging && "opacity-50 z-50 ring-2 ring-indigo-500/50 rounded-xl"
            )}
        >
            <DragHandle />
            {blockContent}
        </div>
    );
}
