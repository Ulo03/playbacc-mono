import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.js";

// ── Schema & enums ──────────────────────────────

export const musicSchema = pgSchema("music");

export const accountProviderEnum = musicSchema.enum("account_provider", [
  "Spotify",
]);

export const jobStatusEnum = musicSchema.enum("job_status", [
  "Queued",
  "Processing",
  "Completed",
  "Failed",
  "Cancelled",
]);

export const syncStatusEnum = musicSchema.enum("sync_status", [
  "idle",
  "syncing",
  "failed",
]);

// ── Core entities ───────────────────────────────

export const artists = musicSchema.table(
  "artists",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    sortName: text("sort_name"),
    mbId: uuid("mb_id").unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_artists_name").on(table.name)],
);

export const albums = musicSchema.table(
  "albums",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    releaseDate: date("release_date"),
    mbId: uuid("mb_id").unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_albums_title").on(table.title)],
);

export const tracks = musicSchema.table(
  "tracks",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    durationMs: integer("duration_ms"),
    mbId: uuid("mb_id").unique(),
    isrc: text("isrc").unique(),
    explicit: boolean("explicit").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_tracks_title").on(table.title)],
);

// ── Join tables ─────────────────────────────────

export const trackArtists = musicSchema.table(
  "track_artists",
  {
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(true),
    order: integer("order").notNull(),
    joinPhrase: text("join_phrase"),
  },
  (table) => [
    primaryKey({ columns: [table.trackId, table.artistId] }),
    index("idx_track_artists_reverse").on(table.artistId),
  ],
);

export const trackAlbums = musicSchema.table(
  "track_albums",
  {
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    discNumber: integer("disc_number"),
    position: integer("position"),
  },
  (table) => [
    primaryKey({ columns: [table.trackId, table.albumId] }),
    index("idx_track_albums_reverse").on(table.albumId),
  ],
);

export const albumArtists = musicSchema.table(
  "album_artists",
  {
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(true),
    order: integer("order").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.albumId, table.artistId] }),
    index("idx_album_artists_reverse").on(table.artistId),
  ],
);

export const artistsGroups = musicSchema.table(
  "artists_groups",
  {
    memberId: uuid("member_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => artists.id, { onDelete: "restrict" }),
    startDate: date("start_date"),
    endDate: date("end_date"),
  },
  (table) => [
    primaryKey({ columns: [table.memberId, table.groupId] }),
    index("idx_artists_groups_reverse").on(table.groupId),
  ],
);

// ── Alias tables ────────────────────────────────

export const artistsAlias = musicSchema.table(
  "artists_alias",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    sortName: text("sort_name"),
    isPrimary: boolean("is_primary").notNull(),
    locale: text("locale"),
  },
  (table) => [
    index("idx_artist_alias_search").on(table.alias),
    uniqueIndex("idx_artist_alias_unique").on(table.artistId, table.alias),
  ],
);

export const tracksAlias = musicSchema.table(
  "tracks_alias",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    sortName: text("sort_name"),
    isPrimary: boolean("is_primary").notNull(),
    locale: text("locale"),
  },
  (table) => [
    uniqueIndex("idx_track_alias_unique").on(table.trackId, table.alias),
  ],
);

export const albumsAlias = musicSchema.table(
  "albums_alias",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    sortName: text("sort_name"),
    isPrimary: boolean("is_primary").notNull(),
    locale: text("locale"),
  },
  (table) => [
    uniqueIndex("idx_album_alias_unique").on(table.albumId, table.alias),
  ],
);

// ── Provider mapping tables ─────────────────────

export const providerArtistMappings = musicSchema.table(
  "provider_artist_mappings",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    provider: accountProviderEnum("provider").notNull(),
    externalId: text("external_id").notNull(),
    externalUrl: text("external_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_provider_artist_unique").on(
      table.provider,
      table.externalId,
    ),
    index("idx_artist_provider").on(table.artistId, table.provider),
  ],
);

export const providerTrackMappings = musicSchema.table(
  "provider_track_mappings",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    provider: accountProviderEnum("provider").notNull(),
    externalId: text("external_id").notNull(),
    externalUrl: text("external_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_provider_track_unique").on(
      table.provider,
      table.externalId,
    ),
    index("idx_track_provider").on(table.trackId, table.provider),
  ],
);

export const providerAlbumMappings = musicSchema.table(
  "provider_album_mappings",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    provider: accountProviderEnum("provider").notNull(),
    externalId: text("external_id").notNull(),
    externalUrl: text("external_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_provider_album_unique").on(
      table.provider,
      table.externalId,
    ),
    index("idx_album_provider").on(table.albumId, table.provider),
  ],
);

// ── Job & sync tables ───────────────────────────

export const providerSyncState = musicSchema.table(
  "provider_sync_state",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: accountProviderEnum("provider").notNull(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    syncStatus: syncStatusEnum("sync_status").notNull().default("idle"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.provider] })],
);

export const importJobs = musicSchema.table(
  "import_jobs",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    fileHash: text("file_hash").notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    filePath: text("file_path").notNull(),
    status: jobStatusEnum("status").notNull().default("Queued"),
    totalRecords: integer("total_records"),
    importedRecords: integer("imported_records").notNull().default(0),
    failedRecords: integer("failed_records").notNull().default(0),
    errorMessage: jsonb("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_imports_user").on(table.userId),
    uniqueIndex("idx_imports_user_file_hash").on(table.userId, table.fileHash),
    index("idx_imports_status").on(table.status),
  ],
);

export const enrichmentJobs = musicSchema.table(
  "enrichment_jobs",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    artistId: uuid("artist_id").references(() => artists.id, {
      onDelete: "cascade",
    }),
    albumId: uuid("album_id").references(() => albums.id, {
      onDelete: "cascade",
    }),
    trackId: uuid("track_id").references(() => tracks.id, {
      onDelete: "cascade",
    }),
    status: jobStatusEnum("status").notNull().default("Queued"),
    priority: integer("priority").notNull().default(0),
    retryCount: integer("retry_count").notNull().default(0),
    maxRetries: integer("max_retries").notNull().default(3),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_enrichment_artist")
      .on(table.artistId)
      .where(sql`${table.status} in ('Queued', 'Processing')`),
    uniqueIndex("idx_enrichment_album")
      .on(table.albumId)
      .where(sql`${table.status} in ('Queued', 'Processing')`),
    uniqueIndex("idx_enrichment_track")
      .on(table.trackId)
      .where(sql`${table.status} in ('Queued', 'Processing')`),
    index("idx_enrichment_queue").on(table.status, table.priority),
    index("idx_enrichment_status").on(table.status),
  ],
);

// ── Event tables ────────────────────────────────

export const plays = musicSchema.table(
  "plays",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "restrict" }),
    albumId: uuid("album_id").references(() => albums.id, {
      onDelete: "restrict",
    }),
    importJobId: uuid("import_job_id").references(() => importJobs.id, {
      onDelete: "cascade",
    }),
    playedAt: timestamp("played_at", { withTimezone: true }).notNull(),
    playedDurationMs: integer("played_duration_ms").notNull(),
    skipped: boolean("skipped").notNull().default(false),
    provider: accountProviderEnum("provider").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("no_duplicate_scrobbles")
      .on(table.userId, table.trackId, table.playedAt)
      .where(sql`${table.deletedAt} is null`),
    index("idx_plays_user_time")
      .on(table.userId, table.playedAt)
      .where(sql`${table.deletedAt} is null`),
    index("idx_plays_album")
      .on(table.albumId)
      .where(sql`${table.deletedAt} is null`),
    index("idx_plays_track")
      .on(table.trackId)
      .where(sql`${table.deletedAt} is null`),
    index("idx_scrobbles_import")
      .on(table.importJobId)
      .where(sql`${table.deletedAt} is null`),
    index("idx_plays_deleted").on(table.deletedAt),
  ],
);

// ── Relations ───────────────────────────────────

export const artistsRelations = relations(artists, ({ many }) => ({
  trackArtists: many(trackArtists),
  albumArtists: many(albumArtists),
  aliases: many(artistsAlias),
  providerMappings: many(providerArtistMappings),
  memberOf: many(artistsGroups, { relationName: "member" }),
  groups: many(artistsGroups, { relationName: "group" }),
  enrichmentJobs: many(enrichmentJobs),
}));

export const albumsRelations = relations(albums, ({ many }) => ({
  trackAlbums: many(trackAlbums),
  albumArtists: many(albumArtists),
  aliases: many(albumsAlias),
  providerMappings: many(providerAlbumMappings),
  plays: many(plays),
  enrichmentJobs: many(enrichmentJobs),
}));

export const tracksRelations = relations(tracks, ({ many }) => ({
  trackArtists: many(trackArtists),
  trackAlbums: many(trackAlbums),
  aliases: many(tracksAlias),
  providerMappings: many(providerTrackMappings),
  plays: many(plays),
  enrichmentJobs: many(enrichmentJobs),
}));

export const trackArtistsRelations = relations(trackArtists, ({ one }) => ({
  track: one(tracks, {
    fields: [trackArtists.trackId],
    references: [tracks.id],
  }),
  artist: one(artists, {
    fields: [trackArtists.artistId],
    references: [artists.id],
  }),
}));

export const trackAlbumsRelations = relations(trackAlbums, ({ one }) => ({
  track: one(tracks, {
    fields: [trackAlbums.trackId],
    references: [tracks.id],
  }),
  album: one(albums, {
    fields: [trackAlbums.albumId],
    references: [albums.id],
  }),
}));

export const albumArtistsRelations = relations(albumArtists, ({ one }) => ({
  album: one(albums, {
    fields: [albumArtists.albumId],
    references: [albums.id],
  }),
  artist: one(artists, {
    fields: [albumArtists.artistId],
    references: [artists.id],
  }),
}));

export const artistsGroupsRelations = relations(artistsGroups, ({ one }) => ({
  member: one(artists, {
    fields: [artistsGroups.memberId],
    references: [artists.id],
    relationName: "member",
  }),
  group: one(artists, {
    fields: [artistsGroups.groupId],
    references: [artists.id],
    relationName: "group",
  }),
}));

export const artistsAliasRelations = relations(artistsAlias, ({ one }) => ({
  artist: one(artists, {
    fields: [artistsAlias.artistId],
    references: [artists.id],
  }),
}));

export const tracksAliasRelations = relations(tracksAlias, ({ one }) => ({
  track: one(tracks, {
    fields: [tracksAlias.trackId],
    references: [tracks.id],
  }),
}));

export const albumsAliasRelations = relations(albumsAlias, ({ one }) => ({
  album: one(albums, {
    fields: [albumsAlias.albumId],
    references: [albums.id],
  }),
}));

export const providerArtistMappingsRelations = relations(
  providerArtistMappings,
  ({ one }) => ({
    artist: one(artists, {
      fields: [providerArtistMappings.artistId],
      references: [artists.id],
    }),
  }),
);

export const providerTrackMappingsRelations = relations(
  providerTrackMappings,
  ({ one }) => ({
    track: one(tracks, {
      fields: [providerTrackMappings.trackId],
      references: [tracks.id],
    }),
  }),
);

export const providerAlbumMappingsRelations = relations(
  providerAlbumMappings,
  ({ one }) => ({
    album: one(albums, {
      fields: [providerAlbumMappings.albumId],
      references: [albums.id],
    }),
  }),
);

export const providerSyncStateRelations = relations(
  providerSyncState,
  ({ one }) => ({
    user: one(user, {
      fields: [providerSyncState.userId],
      references: [user.id],
    }),
  }),
);

export const importJobsRelations = relations(importJobs, ({ one, many }) => ({
  user: one(user, {
    fields: [importJobs.userId],
    references: [user.id],
  }),
  plays: many(plays),
}));

export const enrichmentJobsRelations = relations(enrichmentJobs, ({ one }) => ({
  artist: one(artists, {
    fields: [enrichmentJobs.artistId],
    references: [artists.id],
  }),
  album: one(albums, {
    fields: [enrichmentJobs.albumId],
    references: [albums.id],
  }),
  track: one(tracks, {
    fields: [enrichmentJobs.trackId],
    references: [tracks.id],
  }),
}));

export const playsRelations = relations(plays, ({ one }) => ({
  user: one(user, {
    fields: [plays.userId],
    references: [user.id],
  }),
  track: one(tracks, {
    fields: [plays.trackId],
    references: [tracks.id],
  }),
  album: one(albums, {
    fields: [plays.albumId],
    references: [albums.id],
  }),
  importJob: one(importJobs, {
    fields: [plays.importJobId],
    references: [importJobs.id],
  }),
}));
