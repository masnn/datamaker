var file = require('../file')
var Graph = require('./Graph')
var fs = require('fs')
function isObject(obj) {
    return obj != null && typeof obj === 'object' && Array.isArray(obj) === false;
}
function flatten(arr) {
    return arr.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function IO(file_prefix = "", data_id = 0) {
    //Class IO: IO tool class. It will process the input and output files."""
    /*(input_file="", output_file="", data_id="", file_prefix="", input_suffix='.in', output_suffix='.out', disable_output=false) -> None
        input_file, output_file overload:
            None -> make a temp file (if file_prefix is None)
            file object -> treat the file-like object as in/output file
            int -> open file by file descriptor
            str -> a filename or filename template like 'awd{}.in'. ``{}`` will be replaced by ``data_id``
        int data_id -> the id of the data. if it's None, the file names will not contain the id.
        legacy argumants:
            str file_prefix -> the prefix for the input and output files
            str input_suffix = ".in" -> the suffix of the input file
            str output_suffix = ".out" -> the suffix of the output file
        disable_output -> bool, set to true to disable output
        Examples:
            IO("a","b") -> create input file "a" and output file "b"
            IO("a.in","b.out") -> create input file "a.in" and output file "b.out"
            IO(file_prefix="data") -> create input file "data.in" and output file "data.out"
            IO(file_prefix="data",data_id=1) -> create input file "data1.in" and output file "data1.out"
            IO(file_prefix="data",input_suffix=".input") -> create input file "data.input" and output file "data.out"
            IO(file_prefix="data",output_suffix=".output") -> create input file "data.in" and output file "data.output"
            IO(file_prefix="data",data_id=2,input_suffix=".input") -> create input file "data2.input" and output file "data2.out"
            IO("data{}.in","data{}.out",data_id=2) -> create input file "data2.in" and output file "data2.out"
            IO(open('data.in', 'w+'), open('data.out', 'w+')) -> input file "data.in" and output file "data.out"
    */
    [this.input_filename, this.output_filename] = ["", ""]
    [this.__input_temp, this.__output_temp] = [false, false]
    //this.__init_file(input_file, data_id, 'i')
    this.input_file = fs.createWriteStream(file_prefix + data_id + '.in');
    this.output_file = fs.createWriteStream(file_prefix + data_id + '.out');
    //if (!disable_output) this.__init_file(output_file, data_id, 'o')
    //else this.output_file = ""
    this.__closed = false
    this.is_first_char = {}
    this.__escape_format = function (st) {
        //replace "{}" to "{{}}" """
        ////return re.sub(r'\{', '{{', re.sub(r'\}', '}}', st))
        return st;
    }
    this.__del_files = function () {
        //delete files"""
        if (this.__input_temp && this.input_filename != "")
            os.remove(this.input_filename)
        if (this.__output_temp && this.output_filename != "")
            os.remove(this.output_filename)
    }
    this.close = function () {
        //Delete the IO object and close the input file and the output file"""
        if (this.__closed) return
        var deleted = false
        try {
            // on posix, one can remove a file while it's opend by a process
            // the file then will be not visable to others, but process still have the file descriptor
            // it is recommand to remove temp file before close it on posix to avoid race
            // on nt, it will just fail and raise OSError so that after closing remove it again
            this.__del_files()
            var deleted = true
        } catch (e) { }
        if (isinstance(this.input_file, IOBase))
            this.input_file.close()
        if (isinstance(this.output_file, IOBase))
            this.output_file.close()
        if (!deleted) this.__del_files()
        this.__closed = true
    }
    this.__del__ = function () {
        this.close()
    }
    this.__enter__ = function () {
        return this
    }
    this.__exit__ = function (exc_type, exc_val, exc_tb) {
        this.close()
    }
    this.__write = function (file, args, kwargs = {}) {
        /*__write(self, file, *args, **kwargs) -> None
            Write every element in *args into file. If the element isn't "\n", insert a space. It will convert every element into str
            file file -> the file object to write
            **kwargs:
                str separator = " " -> a string used to separate every element
        */

        separator = kwargs.separator || " "
        if (kwargs.graph){
            
            args.forEach(arg => {
                file.write(arg.start + separator + arg.end + separator + arg.weight + '\n');
            });
        }
        else
        if (Array.isArray(args))
            file.write(flatten(args).join(separator));
        else
            for (i in args)
                if (isObject(args[i]))
                    this.__write(file, args[i], kwargs)
                else {
                    file.write(flatten(args[i]).join(separator))
                }
    }
    this.input_write = function (args, kwargs) {
        /*input_write(self, *args, **kwargs) -> None
            Write every element in *args into the input file. Splits with spaces. It will convert every element into string
            **kwargs:
                str separator = " " -> a string used to separate every element
        */
        this.__write(this.input_file, args, kwargs)
    }
    this.input_writeln = function (args, kwargs={}) {
        /*input_writeln(self, *args, **kwargs) -> None
            Write every element in *args into the input file and turn to a new line. Splits with spaces. It will convert every element into string
            **kwargs:
                str separator = " " -> a string used to separate every element
        */
        global.console.log(args)
        if (args instanceof Graph){
            args = flatten(args.edges)
            kwargs.graph=true;
        }else args.push("\n")
        this.input_write(args, kwargs)
    }
    this.output_gen = function (shell_cmd) {
        /*output_gen(self, shell_cmd) -> None
            Run the command shell_cmd(usually the std programme) and send it the input file as stdin. Write its output to the output file.
            str shell_cmd -> the command to run, usually the std programme
        */
        this.flush_buffer()
        origin_pos = this.input_file.tell()
        this.input_file.seek(0)
        subprocess.check_call(shell_cmd, shell = true, stdin = this.input_file, stdout = this.output_file, universal_newlines = true)
        this.input_file.seek(origin_pos)
        log.debug(this.output_filename, " done")
    }
    this.output_write = function (args, kwargs) {
        /*output_write(self, *args, **kwargs) -> None
            Write every element in *args into the output file. Splits with spaces. It will convert every element into string
            **kwargs:
                str separator = " " -> a string used to separate every element
        */
        this.__write(this.output_file, args, kwargs)
    }
    this.output_writeln = function (args, kwargs) {
        /*output_writeln(self, *args, **kwargs) -> None
            Write every element in *args into the output file and turn to a new line. Splits with spaces. It will convert every element into string
            **kwargs:
                str separator = " " -> a string used to separate every element
        */
        args = Array.from(args)
        args.push("\n")
        this.output_write(args, kwargs)
    }
    this.flush_buffer = function () {
        this.input_file.flush()
    }
}
module.exports = IO