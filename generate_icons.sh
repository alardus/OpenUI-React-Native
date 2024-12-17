#!/bin/bash

# Путь к оригинальной иконке
ICON_PATH="./assets/app-icon.png"

# Очистка старых иконок
rm -rf android/app/src/main/res/mipmap-*
rm -rf ios/OpenUI/Images.xcassets/AppIcon.appiconset/*

# Android иконки - создаем директории
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi
mkdir -p android/app/src/main/res/mipmap-anydpi-v26

# Генерация иконок для Android
convert "$ICON_PATH" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert "$ICON_PATH" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert "$ICON_PATH" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert "$ICON_PATH" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert "$ICON_PATH" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

# Генерация адаптивной иконки для Android
convert "$ICON_PATH" -resize 432x432 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png
convert "$ICON_PATH" -resize 324x324 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png
convert "$ICON_PATH" -resize 216x216 android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png
convert "$ICON_PATH" -resize 162x162 android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
convert "$ICON_PATH" -resize 108x108 android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png

# Копируем круглые иконки как обычные
cp android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Создаем XML файлы для адаптивных иконок
cat > android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml << EOL
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
EOL

cat > android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml << EOL
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
EOL

# Создаем файл с цветом фона
mkdir -p android/app/src/main/res/values
cat > android/app/src/main/res/values/colors.xml << EOL
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#1A1A1A</color>
</resources>
EOL

# iOS иконки
mkdir -p ios/OpenUI/Images.xcassets/AppIcon.appiconset

# Генерация иконок для iOS
convert "$ICON_PATH" -resize 20x20 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-20.png
convert "$ICON_PATH" -resize 40x40 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-20@2x.png
convert "$ICON_PATH" -resize 60x60 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-20@3x.png
convert "$ICON_PATH" -resize 29x29 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-29.png
convert "$ICON_PATH" -resize 58x58 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-29@2x.png
convert "$ICON_PATH" -resize 87x87 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-29@3x.png
convert "$ICON_PATH" -resize 40x40 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-40.png
convert "$ICON_PATH" -resize 80x80 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-40@2x.png
convert "$ICON_PATH" -resize 120x120 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-40@3x.png
convert "$ICON_PATH" -resize 120x120 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png
convert "$ICON_PATH" -resize 180x180 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-60@3x.png
convert "$ICON_PATH" -resize 76x76 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-76.png
convert "$ICON_PATH" -resize 152x152 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png
convert "$ICON_PATH" -resize 167x167 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-83.5@2x.png
convert "$ICON_PATH" -resize 1024x1024 ios/OpenUI/Images.xcassets/AppIcon.appiconset/Icon-1024.png

echo "Icons generated successfully!" 