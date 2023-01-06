plugins {
    id("org.jetbrains.kotlin.jvm") version "1.6.0"
}

group = "com.gitlab.joemama"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0")
}

tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class) {
    this.targetCompatibility = "11"
}