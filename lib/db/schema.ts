import {pgTable, text, uuid, integer, boolean, timestamp} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"


export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    // basic file/folder info
    name: text("name").notNull(),
    path: text("path").notNull(), // /document/project/resume
    size: integer("size").notNull(),
    type: text("type").notNull(), // "folder"

    // storage information
    fileUrl: text("file_url").notNull(), // url to acess file
    thumbnailUrl: text("thumbnail_url"),

    // Ownership information
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"), // parent folder id (null for root items)

    // files/folder flags (this is where we design features)

    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred: boolean("is_starred").default(false).notNull(),
    isTrash: boolean("is_Trash").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

})

/*
parent: each file/folder can have one parent folder 

children: each folder can have many child --> files/folders

*/

export const filesRealtions = relations(files, ({one, many}) => ({
    parent: one(files, {
        fields: [files.parentId], // foreign key
        references: [files.id], // reference of foreign key
    }),

    // realtionship to child files/folder
    children: many(files)
}))

// Type definations (superpower of drizzle-orm)

export const File = typeof files.$inferSelect; 
export const NewFile = typeof files.$inferInsert;

// converts the upper code in a format we use in mongodb file = { id : string , time : timestapmp , ... }
