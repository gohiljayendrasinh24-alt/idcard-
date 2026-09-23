import React from 'react';
import {
  Camera,
  Upload,
  User,
  School,
  Palette,
  ShieldCheck,
  PenTool,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CardDesign, CardThemeId, InstituteConfig, StudentProfile } from '../types/card';
import { CARD_THEMES, DEFAULT_IMAGES } from '../utils/cardDefaults';

interface EditorPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  student: StudentProfile;
  onStudentChange: (student: StudentProfile) => void;
  institute: InstituteConfig;
  onInstituteChange: (inst: InstituteConfig) => void;
  design: CardDesign;
  onDesignChange: (design: CardDesign) => void;
  onOpenSignaturePad: () => void;
  onOpenWebcam: () => void;
  language: 'gu' | 'en';
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  activeTab,
  onTabChange,
  student,
  onStudentChange,
  institute,
  onInstituteChange,
  design,
  onDesignChange,
  onOpenSignaturePad,
  onOpenWebcam,
  language,
}) => {
  const isEn = language === 'en';

  const updateStudentField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    onStudentChange({ ...student, [field]: value });
  };

  const updateInstituteField = <K extends keyof InstituteConfig>(field: K, value: InstituteConfig[K]) => {
    onInstituteChange({ ...institute, [field]: value });
  };

  const updateDesignField = <K extends keyof CardDesign>(field: K, value: CardDesign[K]) => {
    onDesignChange({ ...design, [field]: value });
  };

  // Handle local photo file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          updateStudentField('photoUrl', uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          updateInstituteField('logoUrl', uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Tab Navigation Controls */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 overflow-x-auto custom-scrollbar">
        {[
          { id: 'student', icon: User, label: isEn ? 'Student' : 'વિદ્યાર્થી' },
          { id: 'school', icon: School, label: isEn ? 'School' : 'શાળા' },
          { id: 'design', icon: Palette, label: isEn ? 'Design' : 'ડિઝાઇન' },
          { id: 'security', icon: ShieldCheck, label: isEn ? 'Security' : 'સુરક્ષા' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex-1 justify-center ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar text-xs">
        {/* TAB 1: STUDENT DETAILS */}
        {activeTab === 'student' && (
          <div className="space-y-4">
            {/* Photo Management Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800 text-xs block mb-2">
                {isEn ? 'Student Photograph' : 'વિદ્યાર્થીનો પાસપોર્ટ સાઇઝ ફોટો'}
              </span>

              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white shadow-xs shrink-0 flex items-center justify-center">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 text-[10px]">No Photo</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEn ? 'Upload Photo' : 'ફોટો અપલોડ'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={onOpenWebcam}
                      className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Camera' : 'કેમેરા'}</span>
                    </button>
                  </div>

                  {/* Sample portraits toggle */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500">સેમ્પલ:</span>
                    <button
                      onClick={() => updateStudentField('photoUrl', DEFAULT_IMAGES.malePortrait)}
                      className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded hover:border-indigo-400 text-slate-600"
                    >
                      છોકરો (Male)
                    </button>
                    <button
                      onClick={() => updateStudentField('photoUrl', DEFAULT_IMAGES.femalePortrait)}
                      className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded hover:border-indigo-400 text-slate-600"
                    >
                      છોકરી (Female)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  વિદ્યાર્થીનું પૂરું નામ (ગુજરાતી)
                </label>
                <input
                  type="text"
                  value={student.fullNameGu}
                  onChange={(e) => updateStudentField('fullNameGu', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900"
                  placeholder="દા.ત. જયેન્દ્રસિંહ કે. ગોહિલ"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Full Name (English)
                </label>
                <input
                  type="text"
                  value={student.fullNameEn}
                  onChange={(e) => updateStudentField('fullNameEn', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900"
                  placeholder="e.g. Jayendrasinh K. Gohil"
                />
              </div>
            </div>

            {/* GR / Roll No */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Student ID / GR No.' : 'જી.આર. નં. / વિદ્યાર્થી આઈડી'}
                </label>
                <input
                  type="text"
                  value={student.studentId}
                  onChange={(e) => updateStudentField('studentId', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Roll No.' : 'રોલ નંબર'}
                </label>
                <input
                  type="text"
                  value={student.rollNo}
                  onChange={(e) => updateStudentField('rollNo', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Grade / Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  ધોરણ અને વર્ગ (ગુજરાતી)
                </label>
                <input
                  type="text"
                  value={student.gradeGu}
                  onChange={(e) => updateStudentField('gradeGu', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  placeholder="દા.ત. ધોરણ ૧૦ - અ"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Class & Division (English)
                </label>
                <input
                  type="text"
                  value={student.gradeEn}
                  onChange={(e) => updateStudentField('gradeEn', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  placeholder="e.g. Std 10th - Div A"
                />
              </div>
            </div>

            {/* DOB & Blood Group */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Date of Birth (DOB)' : 'જન્મ તારીખ'}
                </label>
                <input
                  type="text"
                  value={student.dob}
                  onChange={(e) => updateStudentField('dob', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Blood Group' : 'રક્ત જૂથ (Blood Group)'}
                </label>
                <select
                  value={student.bloodGroup}
                  onChange={(e) => updateStudentField('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone & Emergency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Guardian Phone' : 'વાલીનો મોબાઈલ નંબર'}
                </label>
                <input
                  type="text"
                  value={student.phone}
                  onChange={(e) => updateStudentField('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Emergency Contact' : 'ઈમરજન્સી સંપર્ક નંબર'}
                </label>
                <input
                  type="text"
                  value={student.emergencyContact}
                  onChange={(e) => updateStudentField('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {isEn ? 'Residential Address' : 'વિદ્યાર્થીનું રહેઠાણ સરનામું'}
              </label>
              <textarea
                rows={2}
                value={student.addressGu}
                onChange={(e) => updateStudentField('addressGu', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                placeholder="સરનામું દાખલ કરો..."
              />
            </div>

            {/* Academic Year & Validity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Academic Year' : 'શૈક્ષણિક સત્ર'}
                </label>
                <input
                  type="text"
                  value={student.academicYear}
                  onChange={(e) => updateStudentField('academicYear', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Valid Upto' : 'માન્યતા અવધિ'}
                </label>
                <input
                  type="text"
                  value={student.validUpto}
                  onChange={(e) => updateStudentField('validUpto', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Extra Custom Field (Bus route or House) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Custom Label' : 'વધારાનું લેબલ (દા.ત. બસ રૂટ)'}
                </label>
                <input
                  type="text"
                  value={student.extraFieldTitle || ''}
                  onChange={(e) => updateStudentField('extraFieldTitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  placeholder="બસ રૂટ નં. / હાઉસ"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Custom Value' : 'વિગત / મૂલ્ય'}
                </label>
                <input
                  type="text"
                  value={student.extraFieldValue || ''}
                  onChange={(e) => updateStudentField('extraFieldValue', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  placeholder="રૂટ નં. ૦૭"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOOL & EMBLEM */}
        {activeTab === 'school' && (
          <div className="space-y-4">
            {/* School Logo */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800 text-xs block mb-2">
                {isEn ? 'School Crest / Emblem' : 'શાળાનો મોનો / સીલ પ્રતીક'}
              </span>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-300 bg-white shadow-xs shrink-0 flex items-center justify-center p-1">
                  {institute.logoUrl ? (
                    <img
                      src={institute.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-slate-400 text-[10px]">No Logo</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isEn ? 'Upload School Logo' : 'શાળાનો લોગો અપલોડ કરો'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => updateInstituteField('logoUrl', DEFAULT_IMAGES.schoolLogo)}
                    className="text-[11px] text-indigo-600 hover:underline text-left"
                  >
                    {isEn ? 'Use Default Seal' : 'ડિફોલ્ટ સરસ્વતી સીલ વાપરો'}
                  </button>
                </div>
              </div>
            </div>

            {/* School Names */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                શાળા / કોલેજનું નામ (ગુજરાતી)
              </label>
              <input
                type="text"
                value={institute.nameGu}
                onChange={(e) => updateInstituteField('nameGu', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                School / College Name (English)
              </label>
              <input
                type="text"
                value={institute.nameEn}
                onChange={(e) => updateInstituteField('nameEn', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>

            {/* Board Affiliation & Code */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {isEn ? 'Board Affiliation' : 'માન્યતા બોર્ડ (GSEB / CBSE / GU)'}
              </label>
              <input
                type="text"
                value={institute.affiliationGu}
                onChange={(e) => updateInstituteField('affiliationGu', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {isEn ? 'DISE / SSC / Registration Code' : 'DISE કોડ / શાળા રજીસ્ટ્રેશન નંબર'}
              </label>
              <input
                type="text"
                value={institute.code}
                onChange={(e) => updateInstituteField('code', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>

            {/* Address & Contact */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {isEn ? 'Institute Address' : 'શાળાનું સરનામું'}
              </label>
              <input
                type="text"
                value={institute.addressGu}
                onChange={(e) => updateInstituteField('addressGu', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Phone' : 'શાળા ફોન નંબર'}
                </label>
                <input
                  type="text"
                  value={institute.phone}
                  onChange={(e) => updateInstituteField('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {isEn ? 'Website' : 'વેબસાઈટ'}
                </label>
                <input
                  type="text"
                  value={institute.website}
                  onChange={(e) => updateInstituteField('website', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {isEn ? 'Principal / Authority Title' : 'આચાર્યશ્રીનું પદનામ'}
              </label>
              <input
                type="text"
                value={institute.principalTitleGu}
                onChange={(e) => updateInstituteField('principalTitleGu', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                placeholder="આચાર્યશ્રી / Principal"
              />
            </div>
          </div>
        )}

        {/* TAB 3: DESIGN & THEMES */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            {/* Card Orientation */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-2">
                {isEn ? 'Card Layout Orientation' : 'કાર્ડનું લેઆઉટ (ઓરિએન્ટેશન)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateDesignField('layout', 'vertical')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    design.layout === 'vertical'
                      ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="w-6 h-9 mx-auto mb-1 border-2 border-current rounded-xs" />
                  <span className="text-xs">
                    {isEn ? 'Vertical (Lanyard)' : 'ઊભું (લેનયાર્ડ બેજ)'}
                  </span>
                </button>

                <button
                  onClick={() => updateDesignField('layout', 'horizontal')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    design.layout === 'horizontal'
                      ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="w-9 h-6 mx-auto mb-1 border-2 border-current rounded-xs" />
                  <span className="text-xs">
                    {isEn ? 'Horizontal (Wallet PVC)' : 'આડું (વોલેટ PVC)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Themes Palette */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-2">
                {isEn ? 'Color Scheme & Theme' : 'રંગ યોજના અને શૈલી પસંદ કરો'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(CARD_THEMES).map((themeItem) => (
                  <button
                    key={themeItem.id}
                    onClick={() => updateDesignField('themeId', themeItem.id as CardThemeId)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      design.themeId === themeItem.id
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: themeItem.primaryColor }}
                      className="w-5 h-5 rounded-full shadow-xs shrink-0 ring-1 ring-black/10"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 text-[11px] truncate">
                        {isEn ? themeItem.nameEn : themeItem.nameGu}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Language Mode */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-2">
                {isEn ? 'Card Language Mode' : 'કાર્ડ પર ભાષા પ્રદર્શન'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gu', label: 'ગુજરાતી' },
                  { id: 'bilingual', label: 'દ્વિભાષી (Both)' },
                  { id: 'en', label: 'English' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateDesignField('language', mode.id as any)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs transition-all cursor-pointer ${
                      design.language === mode.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Shape */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-2">
                {isEn ? 'Photo Frame Style' : 'ફોટો ફ્રેમ સ્ટાઇલ'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rounded', label: isEn ? 'Rounded' : 'ગોળાકાર ખૂણા' },
                  { id: 'square', label: isEn ? 'Sharp' : 'ચોરસ' },
                  { id: 'circle', label: isEn ? 'Circular' : 'સંપૂર્ણ વર્તુળ' },
                ].map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateDesignField('photoShape', shape.id as any)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs transition-all cursor-pointer ${
                      design.photoShape === shape.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Realistic Lanyard Holder Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800 text-xs block">
                {isEn ? 'Badge Holder & Lanyard' : 'લેનયાર્ડ અને કાર્ડ કેસ સિમ્યુલેશન'}
              </span>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? 'Show Acrylic Badge Case' : 'એક્રેલિક બેજ હોલ્ડર કેસ દર્શાવો'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showLanyardSlot}
                  onChange={(e) => updateDesignField('showLanyardSlot', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? 'Show Hanging Fabric Strap' : 'શાળાનું નામ લખેલી ગળાની પટ્ટી (Strap)'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showLanyardStrap}
                  onChange={(e) => updateDesignField('showLanyardStrap', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & SIGNATURE */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* Principal Signature Pad Trigger */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800 text-xs">
                  {isEn ? 'Principal Digital Signature' : 'આચાર્યશ્રીની ડિજિટલ સહી'}
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">સત્તાવાર માન્ય</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSignaturePad}
                  className="flex-1 px-3 py-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Draw Custom Signature' : 'હાથેથી સહી દોરો'}</span>
                </button>
              </div>
            </div>

            {/* Toggle Security Elements */}
            <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800 text-xs block mb-1">
                {isEn ? 'Security Badges & Code Encoders' : 'સુરક્ષા પ્રતીકો અને સ્કેન કોડ'}
              </span>

              {/* Barcode */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? 'Code 128 Barcode' : 'કોડ ૧૨૮ બારકોડ (સ્કેનેબલ)'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showBarcode}
                  onChange={(e) => updateDesignField('showBarcode', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* QR Code */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? '2D Verification QR Code' : 'વેરિફિકેશન ૨D ક્યુઆર કોડ'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showQrCode}
                  onChange={(e) => updateDesignField('showQrCode', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Hologram */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? 'Holographic Security Seal' : 'હોલોગ્રાફિક સુરક્ષા સીલ (ચળકતું)'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showHologram}
                  onChange={(e) => updateDesignField('showHologram', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Watermark */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? 'Anti-Forgery Watermark' : 'પૃષ્ઠભૂમિ સ્કૂલ વોટરમાર્ક'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showWatermark}
                  onChange={(e) => updateDesignField('showWatermark', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Smart Chip */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 text-xs">
                  {isEn ? 'Smart Card EMV Chip' : 'સ્માર્ટ ચિપ સિમ્યુલેશન (EMV)'}
                </span>
                <input
                  type="checkbox"
                  checked={design.showChip}
                  onChange={(e) => updateDesignField('showChip', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
