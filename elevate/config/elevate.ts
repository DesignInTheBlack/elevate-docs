const options = {
    Watch:'./src/content', // Folder to watch for changes
    FileTypes:['mdx', 'md'], //Valid filetypes to watch for changes
    Output:'./src/styles', //Where to put the compiled CSS
    Extend:[], //CSS files to include as well
    ClassRegex: [
        /\bclass\s*=\s*"([^"]*)"/g,                          // class="..."
        /\bclassName\s*=\s*"([^"]*)"/g,                      // className="..."
        /\bclassName\s*=\s*{\s*`([\s\S]*?)`}/g               // className={`...`}
    ],
    SafeList:[]
}

export const config = options




