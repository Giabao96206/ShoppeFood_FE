# Welcome to your Expo app. In the future i will use React CLI with Kotlin to make more App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

Install Modules: npm expo i

## Run

npm run dev

Nếu build npx expo run:android lỗi nhiều quá thì ( lỗi bên Expo )
B1: Gỡ Androi
B2: Cài lại npx expo prebuild --clean
B3: cd androi
B4: .\gradlew assembleDebug
B5: Vào android/app/build/outputs/apk/debug/ lấy .apk
B6: Paste : adb install android/app/build/outputs/apk/debug/app-debug.apk (Nhớ cắm cáp)
B7: npx expo start
