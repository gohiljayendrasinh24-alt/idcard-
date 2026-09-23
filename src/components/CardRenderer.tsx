import React from 'react';
import { CardDesign, CardTheme, InstituteConfig, StudentProfile } from '../types/card';
import { BarcodeSVG, HologramBadge, OfficialStampSVG, PrincipalSignatureSVG, QRCodeSVG, SmartChipSVG } from '../utils/cardSvgUtils';

interface CardRendererProps {
  student: StudentProfile;
  institute: InstituteConfig;
  design: CardDesign;
  theme: CardTheme;
  side?: 'front' | 'back';
  id?: string;
  isPrintable?: boolean;
}

export const CardRenderer: React.FC<CardRendererProps> = ({
  student,
  institute,
  design,
  theme,
  side = 'front',
  id,
  isPrintable = false,
}) => {
  const isVertical = design.layout === 'vertical';
  const isBilingual = design.language === 'bilingual';
  const isEn = design.language === 'en';

  const instituteName = isEn ? institute.nameEn : institute.nameGu;
  const secondaryInstName = isBilingual ? institute.nameEn : (isEn ? institute.nameGu : institute.nameEn);
  
  const studentName = isEn ? student.fullNameEn : student.fullNameGu;
  const secondaryStudentName = isBilingual ? student.fullNameEn : (isEn ? student.fullNameGu : student.fullNameEn);

  const grade = isEn ? student.gradeEn : student.gradeGu;
  const house = isEn ? student.houseEn : student.houseGu;
  const address = isEn ? student.addressEn : student.addressGu;

  const cardRadius = design.cardCurvature;

  // Front Side Rendering
  const renderFront = () => {
    if (isVertical) {
      // VERTICAL PORTRAIT CARD (Standard Lanyard Format)
      return (
        <div
          className={`relative bg-white text-slate-900 overflow-hidden flex flex-col justify-between border border-slate-200/80 ${cardRadius} ${
            isPrintable ? 'id-card-printable' : 'shadow-xl'
          }`}
          style={{
            width: '320px',
            height: '495px',
            fontFamily: "'Plus Jakarta Sans', 'Noto Sans Gujarati', sans-serif",
          }}
        >
          {/* Subtle Guilloche / Geometric Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Watermark Logo (Center background) */}
          {design.showWatermark && institute.logoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] overflow-hidden">
              <img
                src={institute.logoUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-48 h-48 object-contain filter grayscale"
              />
            </div>
          )}

          {/* Top Header Strip with Gradient & Institute Branding */}
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className={`relative p-3.5 pb-2.5 text-white bg-linear-to-b ${theme.headerBg} border-b-2 border-amber-400`}
          >
            {/* Lanyard slot cut guide if requested */}
            {design.showLanyardSlot && !isPrintable && (
              <div className="mx-auto -mt-2 mb-1.5 w-7 h-1.5 rounded-full bg-black/30 border border-white/20" />
            )}

            <div className="flex items-center gap-2.5">
              {/* Logo / Seal */}
              <div className="w-12 h-12 shrink-0 rounded-full bg-white p-0.5 shadow-sm border border-amber-300 flex items-center justify-center overflow-hidden">
                {institute.logoUrl ? (
                  <img
                    src={institute.logoUrl}
                    alt="School Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-[10px] font-bold text-blue-900">SVM</div>
                )}
              </div>

              {/* Institution Title */}
              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-[13px] font-bold leading-tight tracking-tight drop-shadow-xs line-clamp-2">
                  {instituteName}
                </h1>
                {secondaryInstName && secondaryInstName !== instituteName && (
                  <div className="text-[9px] text-amber-200/90 font-medium tracking-wide truncate">
                    {secondaryInstName}
                  </div>
                )}
                <div className="text-[8px] text-slate-300 truncate mt-0.5">
                  {institute.code}
                </div>
              </div>
            </div>

            {/* Tagline / Sub-band */}
            <div className="mt-1.5 pt-1 border-t border-white/15 flex items-center justify-between text-[8.5px] text-amber-300 font-semibold tracking-wider uppercase">
              <span>{isEn ? 'STUDENT IDENTITY CARD' : 'વિદ્યાર્થી ઓળખપત્ર'}</span>
              <span className="text-white/90 font-mono text-[9px]">{student.academicYear}</span>
            </div>
          </div>

          {/* Student Photo & Identity Section */}
          <div className="px-4 pt-3 pb-1 flex flex-col items-center">
            {/* Photo Frame with Smart Chip or Hologram */}
            <div className="relative mb-2">
              <div
                className={`w-28 h-32 overflow-hidden border-2 shadow-md bg-slate-100 flex items-center justify-center ${
                  design.photoShape === 'circle'
                    ? 'rounded-full w-28 h-28'
                    : design.photoShape === 'square'
                    ? 'rounded-none'
                    : 'rounded-lg'
                }`}
                style={{ borderColor: theme.primaryColor }}
              >
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={studentName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">ફોટો / Photo</div>
                )}
              </div>

              {/* Hologram or Security Sticker */}
              {design.showHologram && (
                <div className="absolute -bottom-1 -right-1 z-10">
                  <HologramBadge />
                </div>
              )}

              {/* Smart chip option */}
              {design.showChip && (
                <div className="absolute top-2 -left-3 z-10">
                  <SmartChipSVG />
                </div>
              )}
            </div>

            {/* Student Full Name */}
            <div className="text-center w-full">
              <h2
                style={{ color: theme.primaryColor }}
                className="text-[15px] font-extrabold leading-tight tracking-tight truncate px-1"
              >
                {studentName}
              </h2>
              {secondaryStudentName && secondaryStudentName !== studentName && (
                <div className="text-[11px] font-semibold text-slate-600 truncate">
                  {secondaryStudentName}
                </div>
              )}
            </div>
          </div>

          {/* Student Detailed Attributes Grid */}
          <div className="px-4 py-1.5 flex-1 flex flex-col justify-center">
            <div className="bg-slate-50/90 rounded-lg p-2 border border-slate-200/70 text-[10px] space-y-1.5">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {/* G.R. / Student ID */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isEn ? 'GR No:' : 'જી.આર. નં:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 truncate">
                    {student.studentId}
                  </span>
                </div>

                {/* Roll No */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isEn ? 'Roll No:' : 'રોલ નં:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {student.rollNo}
                  </span>
                </div>

                {/* Class / Standard */}
                <div className="col-span-2 flex items-center gap-1">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isEn ? 'Class:' : 'ધોરણ:'}
                  </span>
                  <span className="font-semibold text-slate-900 truncate">
                    {grade}
                  </span>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isEn ? 'DOB:' : 'જન્મ તારીખ:'}
                  </span>
                  <span className="font-mono font-medium text-slate-800">
                    {student.dob}
                  </span>
                </div>

                {/* Blood Group */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isEn ? 'Blood:' : 'રક્ત જૂથ:'}
                  </span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded text-[9.5px]">
                    {student.bloodGroup}
                  </span>
                </div>

                {/* Mobile / Emergency */}
                <div className="col-span-2 flex items-center gap-1">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isEn ? 'Phone:' : 'મોબાઈલ:'}
                  </span>
                  <span className="font-mono font-medium text-slate-800 tracking-tight">
                    {student.phone}
                  </span>
                </div>

                {/* Extra field if present (House or Bus) */}
                {student.extraFieldValue && (
                  <div className="col-span-2 flex items-center gap-1 pt-0.5 border-t border-slate-200/60 text-[9px]">
                    <span className="text-slate-500 font-medium shrink-0">
                      {student.extraFieldTitle || (isEn ? 'Transport:' : 'વાહન:')}
                    </span>
                    <span className="font-medium text-slate-700 truncate">
                      {student.extraFieldValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Barcode, QR & Security Strip */}
          <div className="p-2.5 pt-1 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
            {/* Barcode */}
            {design.showBarcode ? (
              <div className="flex-1 overflow-hidden">
                <BarcodeSVG value={student.studentId.replace(/[^A-Za-z0-9]/g, '') || student.rollNo} height={22} />
              </div>
            ) : (
              <div className="text-[8px] text-slate-400">
                {institute.website}
              </div>
            )}

            {/* QR Code */}
            {design.showQrCode && (
              <div className="shrink-0">
                <QRCodeSVG
                  data={`STUDENT:${student.fullNameEn}|ID:${student.studentId}|ROLL:${student.rollNo}|SCHOOL:${institute.nameEn}`}
                  size={46}
                />
              </div>
            )}
          </div>

          {/* Bottom color accent bar */}
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className="h-1.5 w-full shrink-0"
          />
        </div>
      );
    } else {
      // HORIZONTAL LANDSCAPE CARD (Classic PVC Wallet Format)
      return (
        <div
          className={`relative bg-white text-slate-900 overflow-hidden flex flex-col justify-between border border-slate-200/80 ${cardRadius} ${
            isPrintable ? 'id-card-printable' : 'shadow-xl'
          }`}
          style={{
            width: '440px',
            height: '275px',
            fontFamily: "'Plus Jakarta Sans', 'Noto Sans Gujarati', sans-serif",
          }}
        >
          {/* Subtle Guilloche / Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />

          {/* Watermark */}
          {design.showWatermark && institute.logoUrl && (
            <div className="absolute right-4 top-12 pointer-events-none opacity-[0.05] overflow-hidden">
              <img
                src={institute.logoUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-40 h-40 object-contain filter grayscale"
              />
            </div>
          )}

          {/* Top Header */}
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className={`relative px-4 py-2 text-white bg-linear-to-r ${theme.headerBg} border-b-2 border-amber-400 flex items-center justify-between`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 shrink-0 rounded-full bg-white p-0.5 shadow-sm border border-amber-300 overflow-hidden flex items-center justify-center">
                {institute.logoUrl ? (
                  <img
                    src={institute.logoUrl}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-[10px] font-bold text-blue-900">SVM</div>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-[12.5px] font-bold leading-tight tracking-tight truncate">
                  {instituteName}
                </h1>
                <div className="text-[8px] text-amber-200 truncate">
                  {institute.code}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[8.5px] uppercase font-bold tracking-wider text-amber-300">
                {isEn ? 'STUDENT ID' : 'વિદ્યાર્થી આઈડી'}
              </div>
              <div className="text-[8px] font-mono text-white/90">
                {student.academicYear}
              </div>
            </div>
          </div>

          {/* Horizontal Body Section */}
          <div className="px-4 py-2 flex items-center gap-3.5 flex-1">
            {/* Photo */}
            <div className="relative shrink-0">
              <div
                className={`w-24 h-28 overflow-hidden border-2 shadow-sm bg-slate-100 flex items-center justify-center ${
                  design.photoShape === 'circle'
                    ? 'rounded-full w-24 h-24'
                    : design.photoShape === 'square'
                    ? 'rounded-none'
                    : 'rounded-md'
                }`}
                style={{ borderColor: theme.primaryColor }}
              >
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={studentName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">ફોટો / Photo</div>
                )}
              </div>

              {design.showHologram && (
                <div className="absolute -bottom-1.5 -right-1.5 z-10 scale-90">
                  <HologramBadge />
                </div>
              )}
            </div>

            {/* Student Details Grid */}
            <div className="flex-1 min-w-0">
              <div className="mb-1.5">
                <h2
                  style={{ color: theme.primaryColor }}
                  className="text-[14px] font-extrabold leading-tight tracking-tight truncate"
                >
                  {studentName}
                </h2>
                {secondaryStudentName && secondaryStudentName !== studentName && (
                  <div className="text-[10px] font-medium text-slate-600 truncate">
                    {secondaryStudentName}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9.5px]">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'GR No:' : 'જી.આર. નં:'}</span>
                  <span className="font-mono font-bold text-slate-900">{student.studentId}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'Roll:' : 'રોલ:'}</span>
                  <span className="font-mono font-bold text-slate-900">{student.rollNo}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'Class:' : 'ધોરણ:'}</span>
                  <span className="font-semibold text-slate-900 truncate">{grade}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'DOB:' : 'જન્મ:'}</span>
                  <span className="font-mono text-slate-800">{student.dob}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'Blood:' : 'બ્લડ:'}</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-1 rounded text-[9px]">{student.bloodGroup}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'Phone:' : 'મોબાઈલ:'}</span>
                  <span className="font-mono text-slate-800">{student.phone}</span>
                </div>
              </div>
            </div>

            {/* Side QR */}
            {design.showQrCode && (
              <div className="shrink-0 flex flex-col items-center">
                <QRCodeSVG
                  data={`ID:${student.studentId}|NAME:${student.fullNameEn}|CLASS:${student.gradeEn}`}
                  size={52}
                />
                <span className="text-[7.5px] font-mono text-slate-500 mt-0.5">SCAN ME</span>
              </div>
            )}
          </div>

          {/* Bottom Barcode Strip */}
          <div className="px-4 py-1 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[8px] text-slate-500 font-medium truncate max-w-[180px]">
              {institute.addressGu.substring(0, 32)}
            </div>
            {design.showBarcode && (
              <div className="w-36 overflow-hidden">
                <BarcodeSVG value={student.studentId.replace(/[^A-Za-z0-9]/g, '') || student.rollNo} height={18} showText={false} />
              </div>
            )}
          </div>

          {/* Bottom Accent */}
          <div style={{ backgroundColor: theme.primaryColor }} className="h-1.5 w-full" />
        </div>
      );
    }
  };

  // Back Side Rendering
  const renderBack = () => {
    if (isVertical) {
      // VERTICAL BACK SIDE
      return (
        <div
          className={`relative bg-white text-slate-900 overflow-hidden flex flex-col justify-between border border-slate-200/80 ${cardRadius} ${
            isPrintable ? 'id-card-printable' : 'shadow-xl'
          }`}
          style={{
            width: '320px',
            height: '495px',
            fontFamily: "'Plus Jakarta Sans', 'Noto Sans Gujarati', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className={`p-3 text-white bg-linear-to-b ${theme.headerBg} text-center border-b border-amber-400`}
          >
            <h2 className="text-[12px] font-bold tracking-tight">
              {isEn ? 'GENERAL INSTRUCTIONS & RULES' : 'સામાન્ય સૂચનાઓ અને નિયમો'}
            </h2>
            <div className="text-[8.5px] text-amber-200/90 font-medium">
              {instituteName}
            </div>
          </div>

          {/* Rules & Information */}
          <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between text-[9px] text-slate-700">
            {/* Rules list */}
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-900 shrink-0">૧.</span>
                <span>{isEn ? 'Student must carry this card daily to school/college.' : 'આ ઓળખપત્ર હંમેશા શાળા/કોલેજ સમય દરમિયાન સાથે રાખવું.'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-900 shrink-0">૨.</span>
                <span>{isEn ? 'In case of loss, report immediately to the principal office.' : 'કાર્ડ ખોવાઈ જવાના સંજોગોમાં તુરંત શાળા કાર્યાલયે જાણ કરવી.'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-900 shrink-0">૩.</span>
                <span>{isEn ? 'This ID card is strictly non-transferable.' : 'આ કાર્ડ અન્ય વ્યક્તિને આપવું કે બદલવું સદંતર મનાઈ છે.'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-900 shrink-0">૪.</span>
                <span>{isEn ? 'If found, please return to the institute address below.' : 'જો આ કાર્ડ કોઈને મળે તો કૃપા કરી નીચેના સરનામે પરત કરવું.'}</span>
              </div>
            </div>

            {/* Student Residence & Emergency Contact */}
            <div className="space-y-1 bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
              <div className="font-bold text-[9.5px] text-amber-950 flex items-center justify-between">
                <span>{isEn ? 'Student Address:' : 'વિદ્યાર્થીનું રહેઠાણ સરનામું:'}</span>
                <span className="text-[8.5px] font-mono text-amber-800">
                  {isEn ? 'Emerg:' : 'ઇમરજન્સી:'} {student.emergencyContact}
                </span>
              </div>
              <p className="text-[8.5px] text-slate-600 leading-snug">
                {address}
              </p>
            </div>

            {/* Institute Contact */}
            <div className="text-[8px] text-slate-500 space-y-0.5 border-t border-slate-200 pt-1.5">
              <div className="font-bold text-slate-800">{institute.addressGu}</div>
              <div className="flex items-center justify-between">
                <span>ફોન: {institute.phone}</span>
                <span>ઈમેલ: {institute.email}</span>
              </div>
            </div>

            {/* Signatures & Official Stamp Zone */}
            <div className="pt-2 border-t border-slate-200 flex items-end justify-between px-1 relative">
              {/* Stamp in background of signature */}
              <div className="absolute left-6 bottom-0 z-0">
                <OfficialStampSVG
                  schoolName={institute.nameGu}
                  city="રાજકોટ"
                  size={66}
                  color={theme.primaryColor}
                />
              </div>

              {/* Student Sign Placeholder */}
              <div className="text-center z-10 w-24">
                <div className="h-7 border-b border-dashed border-slate-400" />
                <div className="text-[8px] font-medium text-slate-600 mt-0.5">
                  {isEn ? "Student's Sign" : 'વિદ્યાર્થીની સહી'}
                </div>
              </div>

              {/* Principal Signature */}
              <div className="text-center z-10 w-28">
                <div className="h-7 flex items-end justify-center">
                  <PrincipalSignatureSVG color={theme.primaryColor} />
                </div>
                <div className="border-t border-slate-400 pt-0.5 text-[8px] font-bold text-slate-800">
                  {isEn ? institute.principalTitleEn : institute.principalTitleGu}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Validity Bar */}
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className="p-1.5 text-center text-white text-[8px] font-medium flex items-center justify-between px-3"
          >
            <span>{isEn ? 'Valid Upto:' : 'માન્યતા અવધિ:'} <strong className="font-mono text-amber-300">{student.validUpto}</strong></span>
            <span className="text-[7.5px] text-white/80">{institute.website}</span>
          </div>
        </div>
      );
    } else {
      // HORIZONTAL BACK SIDE
      return (
        <div
          className={`relative bg-white text-slate-900 overflow-hidden flex flex-col justify-between border border-slate-200/80 ${cardRadius} ${
            isPrintable ? 'id-card-printable' : 'shadow-xl'
          }`}
          style={{
            width: '440px',
            height: '275px',
            fontFamily: "'Plus Jakarta Sans', 'Noto Sans Gujarati', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className={`px-4 py-1.5 text-white bg-linear-to-r ${theme.headerBg} flex items-center justify-between border-b border-amber-400`}
          >
            <h2 className="text-[11px] font-bold">
              {isEn ? 'INSTRUCTIONS & RESIDENCE DETAILS' : 'નિયમો અને વિદ્યાર્થીનું રહેઠાણ'}
            </h2>
            <span className="text-[8px] text-amber-300 font-mono">
              {isEn ? 'Valid Upto:' : 'માન્યતા:'} {student.validUpto}
            </span>
          </div>

          {/* Body */}
          <div className="p-3 flex items-start gap-4 flex-1 text-[8.5px]">
            {/* Left: Rules */}
            <div className="flex-1 space-y-1 text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-200/70">
              <div className="font-bold text-slate-900 text-[9px] mb-1">
                {isEn ? 'Terms & Instructions:' : 'શરતો અને સૂચનાઓ:'}
              </div>
              <p>• {isEn ? 'Card must be displayed during school hours.' : 'ઓળખપત્ર શાળા સમય દરમિયાન ગળામાં ધારણ કરવું.'}</p>
              <p>• {isEn ? 'Loss must be reported immediately.' : 'કાર્ડ ગુમાવ્યા પર તુરંત શાળા કાર્યાલયે જાણ કરવી.'}</p>
              <p>• {isEn ? 'Address:' : 'રહેઠાણ:'} {address}</p>
              <p className="text-slate-500 pt-0.5">• ઈમરજન્સી કોન્ટેક્ટ: <strong className="font-mono">{student.emergencyContact}</strong></p>
            </div>

            {/* Right: Stamps & Signatures */}
            <div className="w-40 shrink-0 flex flex-col justify-between h-full pt-1 relative">
              <div className="absolute right-4 top-0 opacity-80 pointer-events-none">
                <OfficialStampSVG schoolName={institute.nameGu} city="રાજકોટ" size={56} color={theme.primaryColor} />
              </div>

              <div className="text-[7.5px] text-slate-500">
                <div>{institute.nameGu}</div>
                <div>{institute.phone}</div>
              </div>

              <div className="text-center pt-4 z-10">
                <div className="flex justify-center">
                  <PrincipalSignatureSVG width={90} height={28} color={theme.primaryColor} />
                </div>
                <div className="border-t border-slate-400 pt-0.5 text-[8px] font-bold text-slate-800">
                  {isEn ? institute.principalTitleEn : institute.principalTitleGu}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ backgroundColor: theme.primaryColor }} className="h-1.5 w-full" />
        </div>
      );
    }
  };

  return (
    <div id={id} className="inline-block">
      {side === 'front' ? renderFront() : renderBack()}
    </div>
  );
};
