import {
  Upload,
  Eye,
  Palette,
  Wand2,
  ArrowRight,
  Sparkles,
  Camera,
} from 'lucide-react';

export default function ProcessGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-24">
      <div className="text-center mb-16">
        <h3 className="text-3xl sm:text-4xl font-light text-black mb-6 luxury-title">
          How It Works
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed luxury-text">
          Professional AI-powered design transformation in four simple steps
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">Upload Space</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Share photos of your interior or exterior space for AI analysis
          </p>
        </div>
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">AI Analysis</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Advanced computer vision identifies architectural elements and style
          </p>
        </div>
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">Style Selection</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Choose your design inspiration through text, images, or Pinterest boards
          </p>
        </div>
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">AI Transform</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Generate photorealistic visualizations of your redesigned space
          </p>
        </div>
      </div>
      <div className="mt-20">
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-12">
            <h4 className="text-2xl sm:text-3xl font-light text-black mb-4 luxury-title">
              Professional Design Workflow
            </h4>
            <p className="text-gray-600 luxury-text">From concept to visualization in minutes, not weeks</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-8 sm:space-y-0 sm:space-x-8">
            <div className="text-center flex-1">
              <div className="w-32 h-24 sm:w-40 sm:h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-700 luxury-text">Original Space</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full" />
                <div className="w-2 h-2 bg-black rounded-full" />
                <div className="w-2 h-2 bg-black rounded-full" />
                <ArrowRight className="w-6 h-6 text-black ml-2" />
              </div>
              <div className="sm:hidden">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-2 h-2 bg-black rounded-full" />
                  <div className="w-2 h-2 bg-black rounded-full" />
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="w-32 h-24 sm:w-40 sm:h-32 mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-gray-200 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-700 luxury-text">AI-Transformed Design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
