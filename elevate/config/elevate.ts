const options = {
    Watch:'./src/content/docs', // Folder to watch for changes
    FileTypes:['mdx','md'], //Valid filetypes to watch for changes
    Output:'./src/styles', //Where to put the compiled CSS
    Extend:[] //CSS files to include as well
}

export const config = options