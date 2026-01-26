interface GenerativeRendererProps {
  htmlCode: string;
}

export function GenerativeRenderer({ htmlCode }: GenerativeRendererProps) {

  if (!htmlCode) {
      return (
          <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-gray-50 text-gray-400">
              Generating Preview...
          </div>
      );
  }

  return (
    <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden relative shadow-inner">
      <iframe 

        title="AI Generated Preview"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin" // Expanded permissions for CDN loading
        srcDoc={htmlCode}
      />
    </div>
  );
}
